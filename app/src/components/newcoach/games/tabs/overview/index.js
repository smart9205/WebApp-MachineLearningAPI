import { Box, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import VideoPlayer from '../../../../coach/VideoPlayer';
import GameService from '../../../../../services/game.service';
import { createCommand } from '../../../components/utilities';
import XmlDataFilter from '../../../components/xmldata';
import GameTagButtonList from './tagButtonList';
import GameTagList from './tagList';
import GameTagControlSection from './tagControlSection';
import GameTagMenu from './tagMenu';
import GameOverviewHeader from './header';

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
        } else createCommand(values.playList, tagIndex, [game.video_url]);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        createCommand(newList, tagIndex, [game.video_url]);
    };

    const handleClickExcel = () => {
        setMenuAnchorEl(null);
    };

    const handleExpandButtons = () => {
        setValues({ ...values, expandButtons: !values.expandButtons });
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
                tagList: res.map((item) => {
                    return {
                        start_time: item.team_tag_start_time,
                        end_time: item.team_tag_end_time
                    };
                })
            });

            if (values.clickRender) createCommand(res, tagIndex, [game.video_url]);
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
        values.playList.map((item, index) => {
            setCheckArray((oldRows) => [...oldRows, values.selectAll]);
        });
    }, [values.selectAll]);

    console.log('GameOverview => ', values.playList);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', minWidth: '600px', flexDirection: 'column', padding: '24px 16px' }}>
                <GameOverviewHeader
                    isOur={values.isOur}
                    ourname={values.teamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    onChangeTeam={handleChangeTeam}
                    mb="8px"
                />
                {values.expandButtons && <GameTagButtonList selectedTag={tagIndex} onShow={handleShowPopover} />}
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
            <VideoPlayer videoData={videoData} url={game.video_url ?? ''} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} isSpecial={true} />
            {exportHudl && <XmlDataFilter game={game} tagList={playerTagList} isOur={values.isOur} tag_name={tagIndex} setExportXML={setExportHudl} />}
        </Box>
    );
};

export default GameOverview;
