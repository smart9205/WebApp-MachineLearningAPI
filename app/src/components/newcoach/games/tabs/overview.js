import { Box, Typography, Divider, Popover, Checkbox, CircularProgress } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import ForwardIcon from '@mui/icons-material/ForwardTwoTone';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import ExportIcon from '@mui/icons-material/FileDownloadOutlined';
import VideoIcon from '@mui/icons-material/SlideshowOutlined';

import VideoPlayer from '../../../coach/VideoPlayer';
import GameService from '../../../../services/game.service';
import { createCommand } from '../../components/utilities';
import XmlDataFilter from '../../components/xmldata';

const Tags = [
    'Game Highlight',
    'Clean Game',
    'All Offensive Possessions',
    'All Defensive Possessions',
    'Offensive Half Build Up',
    'Defensive Half Build Up',
    "Goalkeeper's Build Up",
    "Goalkeeper's Build Up (Kick)",
    'Counter-Attacks',
    'Started From Interception',
    'Started From Tackle',
    'Started From Throw In',
    'Goals',
    'Goal Opportunities',
    'Goal Kicks',
    'Free Kicks',
    'Crosses',
    'Corners',
    'Offsides',
    'Turnovers',
    'Draw Fouls',
    'Penalties Gained',
    'Saved',
    'Clearance',
    'Blocked'
];

const GameOverview = ({ game }) => {
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0);
    const [videoData, setVideoData] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        autoPlay: true,
        tagList: [],
        videoPlay: true
    });
    const [values, setValues] = useState({
        isOur: true,
        expandButtons: true,
        playList: [],
        teamId: -1,
        opponentTeamId: -1,
        selectAll: false,
        clickRender: false,
        clickHudl: false
    });
    const [tagIndex, setTagIndex] = useState('');
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [exportHudl, setExportHudl] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex(-1);
    };

    const handleShowPopover = (idx) => (e) => {
        setTagIndex(idx);
        setMenuAnchorEl(e.currentTarget);
    };

    const handleClickView = () => {
        setLoadData(true);
        setMenuAnchorEl(null);
    };

    const handleClickHudlFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        setPlayerTagList(newList);
        setExportHudl(true);
    };

    const handleClickHudlFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickHudl: true });
            setLoadData(true);
        } else {
            setPlayerTagList(values.playList);
            setExportHudl(true);
        }
    };

    const handleClickRenderFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickRender: true });
            setLoadData(true);
        } else createCommand(values.playList, tagIndex, game.video_url);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        createCommand(newList, tagIndex, game.video_url);
    };

    const handleClickExcel = () => {
        setMenuAnchorEl(null);
    };

    const handleExpandButtons = () => {
        setValues({ ...values, expandButtons: !values.expandButtons });
    };

    const getPeriod = (id) => {
        return id === 1 ? 'H1' : id === 2 ? 'H2' : 'OT';
    };

    const handleShowVideo = (index) => {
        setCurTeamTagIdx(index);
        setVideoData({ ...videoData, idx: index });
    };

    const getPlayTagList = (func) => {
        func.then((res) => {
            console.log('Game/Overview => ', res);
            setLoading(false);
            setLoadData(false);
            setVideoData({
                ...videoData,
                idx: 0,
                tagList: res.map((item) => {
                    return {
                        start_time: item.team_tag_start_time,
                        end_time: item.team_tag_end_time
                    };
                })
            });

            if (values.clickRender) createCommand(res, tagIndex, game.video_url);
            if (values.clickHudl) {
                setPlayerTagList(res);
                setExportHudl(true);
            }

            setValues({ ...values, playList: res, clickRender: false, clickHudl: false });

            let checks = [];

            for (let i = 0; i < res.length; i++) checks.push(false);

            setCheckArray(checks);
        });
    };

    useEffect(() => {
        if (loadData) {
            setLoading(true);
            setValues({ ...values, playList: [] });
            setVideoData({ ...videoData, tagList: [] });

            if (tagIndex === 'Game Highlight') {
                getPlayTagList(GameService.getGameHighlight(values.isOur ? values.teamId : values.opponentTeamId, `${game.id}`));
            } else if (tagIndex === 'Clean Game') {
                getPlayTagList(GameService.getCleanGame(values.isOur ? values.teamId : values.opponentTeamId, `${game.id}`));
            } else if (tagIndex === 'All Offensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffensivePossession(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffensivePossession(values.teamId, `${game.id}`));
            } else if (tagIndex === 'All Defensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamDefensivePossession(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentDefensivePossession(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Goals') {
                if (values.isOur) getPlayTagList(GameService.getTeamGoals(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentGoals(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Goal Opportunities') {
                if (values.isOur) getPlayTagList(GameService.getTeamGoalOpportunity(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentGoalOpportunity(values.teamId, `${game.id}`));
            } else if (tagIndex === "Goalkeeper's Build Up") {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeper(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Defensive Half Build Up') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Offensive Half Build Up') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(values.teamId, `${game.id}`));
            } else if (tagIndex === "Goalkeeper's Build Up (Kick)") {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeperKick(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeperKick(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Started From Interception') {
                if (values.isOur) getPlayTagList(GameService.getTeamInterception(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentInterception(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Started From Tackle') {
                if (values.isOur) getPlayTagList(GameService.getTeamTackle(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentTackle(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Counter-Attacks') {
                if (values.isOur) getPlayTagList(GameService.getTeamCounterAttack(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCounterAttack(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Started From Throw In') {
                if (values.isOur) getPlayTagList(GameService.getTeamThrowIn(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentThrowIn(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Goal Kicks') {
                if (values.isOur) getPlayTagList(GameService.getTeamShots(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentShots(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Free Kicks') {
                if (values.isOur) getPlayTagList(GameService.getTeamFreekick(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentFreekick(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Corners') {
                if (values.isOur) getPlayTagList(GameService.getTeamCorner(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCorner(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Crosses') {
                if (values.isOur) getPlayTagList(GameService.getTeamCross(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCross(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Penalties Gained') {
                if (values.isOur) getPlayTagList(GameService.getTeamPenalty(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentPenalty(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Draw Fouls') {
                if (values.isOur) getPlayTagList(GameService.getTeamDrawfoul(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentDrawfoul(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Offsides') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffside(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffside(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Turnovers') {
                if (values.isOur) getPlayTagList(GameService.getTeamTurnover(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentTurnover(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Saved') {
                if (values.isOur) getPlayTagList(GameService.getTeamSaved(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentSaved(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Clearance') {
                if (values.isOur) getPlayTagList(GameService.getTeamClearance(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentClearance(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Blocked') {
                if (values.isOur) getPlayTagList(GameService.getTeamBlocked(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBlocked(values.teamId, `${game.id}`));
            }
        }
    }, [tagIndex, loadData]);

    useEffect(() => {
        setLoading(true);
        GameService.getAllMyCoachTeam().then((res) => {
            const filtered = res.filter(
                (item) => item.season_name === game.season_name && item.league_name === game.league_name && (item.team_id === game.home_team_id || item.team_id === game.away_team_id)
            );
            const team = filtered[0].team_id;
            const opponent = team === game.home_team_id ? game.away_team_id : game.home_team_id;

            setValues({ ...values, teamId: team, opponentTeamId: opponent });
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setCheckArray([]);

        if (values.selectAll) {
            values.playList.map((item, index) => {
                setCheckArray((oldRows) => [...oldRows, values.selectAll]);
            });
        } else setCheckArray([]);
    }, [values.selectAll]);

    console.log('GameOverview => ', values.playList);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', minWidth: '600px', flexDirection: 'column', padding: '24px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>
                        {values.teamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{ 'svg path:last-of-type': { fill: 'black' }, 'svg path:first-of-type': { fill: values.isOur ? 'green' : 'white', opacity: 1 }, cursor: 'pointer' }}
                            onClick={() => handleChangeTeam(true)}
                        >
                            <ForwardIcon sx={{ transform: 'rotate(180deg)' }} fontSize="large" />
                        </Box>
                        <Box
                            sx={{ 'svg path:last-of-type': { fill: 'black' }, 'svg path:first-of-type': { fill: values.isOur ? 'white' : 'green', opacity: 1 }, cursor: 'pointer' }}
                            onClick={() => handleChangeTeam(false)}
                        >
                            <ForwardIcon fontSize="large" />
                        </Box>
                    </Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>
                        {values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    </Typography>
                </Box>
                {values.expandButtons && (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                            {Tags.slice(0, 12).map((tag, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                                    <Box
                                        sx={{ cursor: 'pointer', 'svg path': { fill: tagIndex === tag ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }}
                                        onClick={handleShowPopover(tag)}
                                    >
                                        <MenuIcon />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', width: 'fit-content' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: tagIndex === tag ? '#0A7304' : '#1a1b1d' }}>{tag}</Typography>
                                        <Box sx={{ width: '100%', height: '2px', background: tagIndex === tag ? '#0A7304' : 'white' }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ width: '100%', height: '1px', background: 'black', margin: '2px 0' }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                            {Tags.slice(12, 25).map((tag, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                                    <Box
                                        sx={{ cursor: 'pointer', 'svg path': { fill: tagIndex === tag ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }}
                                        onClick={handleShowPopover(tag)}
                                    >
                                        <MenuIcon />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', width: 'fit-content' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: tagIndex === tag ? '#0A7304' : '#1a1b1d' }}>{tag}</Typography>
                                        <Box sx={{ width: '100%', height: '2px', background: tagIndex === tag ? '#0A7304' : 'white' }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, height: '1px', background: 'black' }} />
                    <Box sx={{ 'svg path': { fill: 'black' }, cursor: 'pointer' }} onClick={handleExpandButtons}>
                        <UpIcon sx={{ transform: values.expandButtons ? '' : 'rotate(180deg)' }} />
                    </Box>
                </Box>
                <Popover
                    id={menuPopoverId}
                    open={menuPopoverOpen}
                    anchorEl={menuAnchorEl}
                    onClose={() => setMenuAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    sx={{ '& .MuiPopover-paper': { width: '220px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickView}>
                        <VideoIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>View Clips</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickHudlFromMenu}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Hudl</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickRenderFromMenu}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Render</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickExcel}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to "My Edits"</Typography>
                    </Box>
                </Popover>
                {values.playList.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{values.playList.length} Clips</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
                            <Checkbox value={values.selectAll} onChange={(e) => setValues({ ...values, selectAll: e.target.checked })} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Select All</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={handleClickHudlFromButton}>
                            <ExportIcon />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Hudl</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={handleClickRenderFromButton}>
                            <ExportIcon />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Render</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={handleClickExcel}>
                            <ExportIcon />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>My Edits</Typography>
                        </Box>
                    </Box>
                )}
                <Box sx={{ overflowY: 'auto', maxHeight: values.expandButtons ? '15vh' : '50vh', minHeight: '15vh' }}>
                    {loading && (
                        <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </div>
                    )}
                    <Box sx={{ margin: '0 4px 8px 0' }}>
                        {values.playList.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    gap: '8px',
                                    padding: '4px',
                                    justifyContent: 'space-between',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '8px'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleShowVideo(index)}>
                                    <Box
                                        sx={{
                                            background: curTeamTagIdx === index ? '#0A7304' : '#C5EAC6',
                                            borderRadius: '8px',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'white' }}>{index + 1}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>
                                                {tagIndex !== 6
                                                    ? `${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names}`
                                                    : `${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names} - ${item.action_type_names}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.home_team_name}</Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.away_team_name}</Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.game_date}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.team_tag_start_time}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.team_tag_end_time}</Typography>
                                    </Box>
                                    <input
                                        key={index}
                                        type="checkbox"
                                        value={checkArray[index]}
                                        checked={checkArray[index] ? true : false}
                                        style={{ width: '18px', height: '18px' }}
                                        onChange={(e) => setCheckArray({ ...checkArray, [index]: e.target.checked })}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    {values.playList.length === 0 && !loading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>No Data to Display</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <VideoPlayer videoData={videoData} url={game.video_url ?? ''} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} isSpecial={true} />
            {exportHudl && <XmlDataFilter game={game} tagList={playerTagList} isOur={values.isOur} tag_name={tagIndex} setExportXML={setExportHudl} />}
        </Box>
    );
};

export default GameOverview;
