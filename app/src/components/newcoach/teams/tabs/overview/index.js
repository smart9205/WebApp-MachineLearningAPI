import React, { useEffect, useState, useReducer } from 'react';
import { Box, Checkbox, Popover, Typography } from '@mui/material';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import { SaveButton } from '../../../components/common';
import GameOverviewHeader from '../../../games/tabs/overview/header';
import GameTagMenu from '../../../games/tabs/overview/tagMenu';
import GameTagControlSection from '../../../games/tabs/overview/tagControlSection';
import GameTagList from '../../../games/tabs/overview/tagList';
import { gameCreateCommand } from '../../../components/utilities';
import TeamGameSelectDialog from './gameSelectDialog';
import GameService from '../../../../../services/game.service';
import TeamVideoPlayer from './teamVideoPlayer';
import TeamTagButtonList from './tagButtonList';

const TeamOverview = ({ games, teamname, teamId }) => {
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
    const [gameIds, setGameIds] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex(-1);
    };

    const handleShowPopover = (idx) => (e) => {
        if (gameIds.length === 0) {
            window.alert("No selected games. Please click 'Select Games' button to select.");

            return;
        }

        setTagIndex(idx);
        setMenuAnchorEl(e.currentTarget);
    };

    const handleExpandButtons = () => {
        setValues({ ...values, expandButtons: !values.expandButtons });
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
        setValues({ ...values, clickHudl: true });
        setLoadData(true);
    };

    const handleClickRenderFromMenu = () => {
        setMenuAnchorEl(null);
        setValues({ ...values, clickRender: true });
        setLoadData(true);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);
        const ids = newList.map((item) => item.game_id);
        const newVideos = games.filter((game) => ids.includes(game.id)).map((item) => item.video_url);

        gameCreateCommand(newList, tagIndex, newVideos, ids);
    };

    const handleClickExcel = () => {
        setMenuAnchorEl(null);
    };

    const handleShowVideo = (index) => {
        setCurTeamTagIdx(index);
        setVideoData({ ...videoData, idx: index });
    };

    const handleCheckChange = (idx) => (e) => {
        setCheckArray({ ...checkArray, [idx]: e.target.checked });
    };

    const getPlayTagList = (func) => {
        func.then((res) => {
            console.log('Game/Overview => ', res);
            setLoading(false);
            setLoadData(false);
            setVideoData({
                ...videoData,
                idx: 0,
                tagList: res
            });

            if (values.clickRender) {
                const newList = games.filter((item) => gameIds.includes(item.id)).map((game) => game.video_url);

                gameCreateCommand(res, tagIndex, newList, gameIds);
            }

            if (values.clickHudl) {
                setPlayerTagList(res);
                setExportHudl(true);
            }

            setValues({ ...values, playList: res, clickRender: false, clickHudl: false });
            setCheckArray([]);
            res.map((item, index) => {
                setCheckArray((oldRows) => [...oldRows, false]);
            });
        });
    };

    useEffect(() => {
        if (loadData) {
            setLoading(true);
            setValues({ ...values, playList: [] });
            setVideoData({ ...videoData, tagList: [] });

            if (tagIndex === 'All Offensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffensivePossession(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentOffensivePossession(teamId, gameIds.join(',')));
            } else if (tagIndex === 'All Defensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamDefensivePossession(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentDefensivePossession(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Goals') {
                if (values.isOur) getPlayTagList(GameService.getTeamGoals(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentGoals(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Goal Opportunities') {
                if (values.isOur) getPlayTagList(GameService.getTeamGoalOpportunity(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentGoalOpportunity(teamId, gameIds.join(',')));
            } else if (tagIndex === "Goalkeeper's Build Up") {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeper(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Defensive Half Build Up') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Offensive Half Build Up') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(teamId, gameIds.join(',')));
            } else if (tagIndex === "Goalkeeper's Build Up (Kick)") {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeperKick(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeperKick(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Started From Interception') {
                if (values.isOur) getPlayTagList(GameService.getTeamInterception(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentInterception(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Started From Tackle') {
                if (values.isOur) getPlayTagList(GameService.getTeamTackle(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentTackle(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Counter-Attacks') {
                if (values.isOur) getPlayTagList(GameService.getTeamCounterAttack(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentCounterAttack(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Started From Throw In') {
                if (values.isOur) getPlayTagList(GameService.getTeamThrowIn(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentThrowIn(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Goal Kicks') {
                if (values.isOur) getPlayTagList(GameService.getTeamShots(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentShots(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Free Kicks') {
                if (values.isOur) getPlayTagList(GameService.getTeamFreekick(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentFreekick(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Corners') {
                if (values.isOur) getPlayTagList(GameService.getTeamCorner(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentCorner(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Crosses') {
                if (values.isOur) getPlayTagList(GameService.getTeamCross(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentCross(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Penalties Gained') {
                if (values.isOur) getPlayTagList(GameService.getTeamPenalty(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentPenalty(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Draw Fouls') {
                if (values.isOur) getPlayTagList(GameService.getTeamDrawfoul(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentDrawfoul(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Offsides') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffside(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentOffside(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Turnovers') {
                if (values.isOur) getPlayTagList(GameService.getTeamTurnover(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentTurnover(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Saved') {
                if (values.isOur) getPlayTagList(GameService.getTeamSaved(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentSaved(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Clearance') {
                if (values.isOur) getPlayTagList(GameService.getTeamClearance(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentClearance(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Blocked') {
                if (values.isOur) getPlayTagList(GameService.getTeamBlocked(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBlocked(teamId, gameIds.join(',')));
            }
        }
    }, [tagIndex, loadData]);

    useEffect(() => {
        setCheckArray([]);
        values.playList.map((item, index) => {
            setCheckArray((oldRows) => [...oldRows, values.selectAll]);
        });
    }, [values.selectAll]);

    console.log('TeamOverview => ', values.playList, gameIds);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', minHeight: '65vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', maxWidth: '600px', flexDirection: 'column', padding: '24px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <Box sx={{ display: 'flex', flex: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <GameOverviewHeader isOur={values.isOur} ourname={teamname} enemyname="Opponents" onChangeTeam={handleChangeTeam} mb="0" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <SaveButton sx={{ fontWeight: 500, width: '120px', height: '28px' }} onClick={() => setDialogOpen(true)}>
                            Select Games
                        </SaveButton>
                    </Box>
                </Box>
                {values.expandButtons && <TeamTagButtonList selectedTag={tagIndex} onShow={handleShowPopover} />}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, height: '1px', background: 'black' }} />
                    <Box sx={{ 'svg path': { fill: 'black' }, cursor: 'pointer' }} onClick={handleExpandButtons}>
                        <UpIcon sx={{ transform: values.expandButtons ? '' : 'rotate(180deg)' }} />
                    </Box>
                </Box>
                <GameTagMenu
                    anchor={menuAnchorEl}
                    onClose={() => setMenuAnchorEl(null)}
                    onView={handleClickView}
                    onHudl={handleClickHudlFromMenu}
                    onRender={handleClickRenderFromMenu}
                    onEdits={handleClickExcel}
                />
                {values.playList.length > 0 && (
                    <GameTagControlSection
                        clipCount={values.playList.length}
                        isSelectAll={values.selectAll}
                        onAll={(e) => setValues({ ...values, selectAll: e.target.checked })}
                        onHudl={handleClickHudlFromButton}
                        onRender={handleClickRenderFromButton}
                        onEdits={handleClickExcel}
                    />
                )}
                <GameTagList
                    isLoading={loading}
                    expand={values.expandButtons}
                    tagList={values.playList}
                    curTagListIdx={curTeamTagIdx}
                    isAction={tagIndex === 'Goals'}
                    checkArr={checkArray}
                    onChecked={handleCheckChange}
                    onVideo={handleShowVideo}
                />
            </Box>
            <TeamVideoPlayer videoData={videoData} games={games} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} />
            <TeamGameSelectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} gameList={games} setIds={setGameIds} />
        </Box>
    );
};

export default TeamOverview;
