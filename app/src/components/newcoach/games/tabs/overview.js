import { Box, Typography, Divider, Popover, Checkbox } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import ForwardIcon from '@mui/icons-material/ForwardTwoTone';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import ExportIcon from '@mui/icons-material/FileDownloadOutlined';
import RefreshIcon from '@mui/icons-material/RefreshOutlined';

import VideoPlayer from '../../../coach/VideoPlayer';
import GameService from '../../../../services/game.service';
import { LoadingProgress } from '../../components/common';

const Tags = [
    'Game Highlight',
    'Clean Game',
    'All Offensive Possessions',
    'All Defensive Possessions',
    'Goals',
    'Goal Opportunities',
    "Goalkeeper's Build Up",
    'Defensive Half Build Up',
    'Offensive Half Build Up',
    'Counter-Attacks',
    'Started From Interception',
    'Started From Tackle',
    'Started From Throw In',
    'Started From Pick Up',
    'Goal Kicks',
    'Free Kicks',
    'Corners',
    'Crosses',
    'Penalties Gained',
    'Draw Fouls',
    'Offsides',
    'Fouls'
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
        selectAll: false
    });
    const [tagIndex, setTagIndex] = useState(-1);
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex(-1);
    };

    const handleShowPopover = (idx) => (e) => {
        console.log('Game/Overview => ', idx);
        setTagIndex(idx);
        setMenuAnchorEl(e.currentTarget);
    };

    const handleClickEdit = () => {
        setLoadData(true);
        setMenuAnchorEl(null);
    };

    const handleClickSportGate = async () => {
        // await getAllInfosByGame(row);
        // setExportGate(true);
        setMenuAnchorEl(null);
    };

    const handleClickExcel = async () => {
        // await getAllInfosByGame(row);
        // setExportExcel(true);
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
            setValues({ ...values, playList: res });
            setLoading(false);
            setLoadData(false);
            setVideoData({
                ...videoData,
                tagList: res.map((item) => {
                    return {
                        start_time: item.team_tag_start_time,
                        end_time: item.team_tag_end_time
                    };
                })
            });

            let checks = [];

            for (let i = 0; i < res.length; i++) checks.push(false);

            setCheckArray(checks);
        });
    };

    useEffect(() => {
        if (loadData) {
            setLoading(true);
            setValues({ ...values, playList: [] });

            if (tagIndex === 0) {
            } else if (tagIndex === 1) {
                GameService.getCleanGame(values.isOur ? values.teamId : values.opponentTeamId, `${game.id}`).then((res) => {
                    console.log('Game/Overview => ', res);
                    setLoading(false);
                    setLoadData(false);
                });
            } else if (tagIndex === 2) {
                if (values.isOur) getPlayTagList(GameService.getTeamOffensivePossession(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffensivePossession(values.teamId, `${game.id}`));
            } else if (tagIndex === 3) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 4) {
                if (values.isOur) getPlayTagList(GameService.getTeamGoals(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentGoals(values.teamId, `${game.id}`));
            } else if (tagIndex === 5) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 6) {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(values.teamId, `${game.id}`));
            } else if (tagIndex === 7) {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(values.teamId, `${game.id}`));
            } else if (tagIndex === 8) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 9) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 10) {
                if (values.isOur) getPlayTagList(GameService.getTeamInterception(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentInterception(values.teamId, `${game.id}`));
            } else if (tagIndex === 11) {
                if (values.isOur) getPlayTagList(GameService.getTeamTackle(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentTackle(values.teamId, `${game.id}`));
            } else if (tagIndex === 12) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 13) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 14) {
                setLoading(false);
                setLoadData(false);
            } else if (tagIndex === 15) {
                if (values.isOur) getPlayTagList(GameService.getTeamFreekick(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentFreekick(values.teamId, `${game.id}`));
            } else if (tagIndex === 16) {
                if (values.isOur) getPlayTagList(GameService.getTeamCorner(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCorner(values.teamId, `${game.id}`));
            } else if (tagIndex === 17) {
                if (values.isOur) getPlayTagList(GameService.getTeamCross(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCross(values.teamId, `${game.id}`));
            } else if (tagIndex === 18) {
                if (values.isOur) getPlayTagList(GameService.getTeamPenalty(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentPenalty(values.teamId, `${game.id}`));
            } else if (tagIndex === 19) {
                if (values.isOur) getPlayTagList(GameService.getTeamDrawfoul(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentDrawfoul(values.teamId, `${game.id}`));
            } else if (tagIndex === 20) {
                if (values.isOur) getPlayTagList(GameService.getTeamOffside(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffside(values.teamId, `${game.id}`));
            } else {
                setLoading(false);
                setLoadData(false);
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
        values.playList.map((item) => {
            setCheckArray((oldRows) => [...oldRows, values.selectAll]);
        });
    }, [values.selectAll]);

    console.log('GameOverview => ', values.playList, game, values.teamId);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '85vh', height: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', minWidth: '600px', flexDirection: 'column', gap: '8px', padding: '24px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
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
                            {Tags.slice(0, 6).map((tag, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                                    <Box
                                        sx={{ cursor: 'pointer', 'svg path': { fill: tagIndex === index ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }}
                                        onClick={handleShowPopover(index)}
                                    >
                                        <MenuIcon />
                                    </Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{tag}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ width: '100%', height: '1px', background: 'black' }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                            {Tags.slice(6, 14).map((tag, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                                    <Box
                                        sx={{ cursor: 'pointer', 'svg path': { fill: tagIndex - 6 === index ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }}
                                        onClick={handleShowPopover(index + 6)}
                                    >
                                        <MenuIcon />
                                    </Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{tag}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ width: '100%', height: '1px', background: 'black' }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                            {Tags.slice(14, 22).map((tag, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                                    <Box
                                        sx={{ cursor: 'pointer', 'svg path': { fill: tagIndex - 14 === index ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }}
                                        onClick={handleShowPopover(index + 14)}
                                    >
                                        <MenuIcon />
                                    </Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{tag}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {loading && <LoadingProgress />}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px 0 0 12px', cursor: 'pointer' }} onClick={handleClickEdit}>
                        <RefreshIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>View Clips</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickSportGate}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Hudl</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '0 12px 12px 0', cursor: 'pointer' }} onClick={handleClickExcel}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Render</Typography>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '0 12px 12px 0', cursor: 'pointer' }} onClick={handleClickExcel}>
                        <ExportIcon />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to "My Edits"</Typography>
                    </Box>
                </Popover>
                <Box sx={{ overflowY: 'auto', maxHeight: values.expandButtons ? '30vh' : '60vh', minHeight: '30vh' }}>
                    <Box sx={{ marginRight: '4px' }}>
                        {values.playList.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', paddingRight: '36px' }}>
                                    <Checkbox value={values.selectAll} onChange={(e) => setValues({ ...values, selectAll: e.target.checked })} />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Select All</Typography>
                                </Box>
                            </Box>
                        )}
                        {values.playList.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', padding: '4px 0', justifyContent: 'space-between' }}>
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
                                                {`${getPeriod(item.period)} - ${item.time_in_game}' - ${item.court_area_name} - ${item.player_name} - `}
                                            </Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>
                                                {`${item.team_tag_start_time} - ${item.team_tag_end_time}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.home_team_name}</Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.away_team_name}</Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.game_date}</Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.season_name}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Checkbox value={checkArray[index]} onChange={(e) => setCheckArray({ ...checkArray, [index]: e.target.checked })} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <VideoPlayer videoData={videoData} url={game.video_url ?? ''} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} />
        </Box>
    );
};

export default GameOverview;
