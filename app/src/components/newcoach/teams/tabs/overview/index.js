import React, { useEffect, useState, useReducer } from 'react';
import { Box } from '@mui/material';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import GameOverviewHeader from '../../../games/tabs/overview/header';
import GameTagMenu from '../../../games/tabs/overview/tagMenu';
import GameTagControlSection from '../../../games/tabs/overview/tagControlSection';
import GameTagList from '../../../games/tabs/overview/tagList';
import { gameCreateCommand } from '../../../components/utilities';
import GameService from '../../../../../services/game.service';
import TeamVideoPlayer from './teamVideoPlayer';
import GameTagButtonList from '../../../games/tabs/overview/tagButtonList';
import GameExportToEdits from '../../../games/tabs/overview/exportEdits';
import { getPeriod } from '../../../games/tabs/overview/tagListItem';
import { XmlDataFilterTeamOverview } from '../../../components/xmldatateam';

const TeamOverview = ({ games, gameIds, teamname, teamId, t }) => {
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0);
    const [videoData, setVideoData] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        autoPlay: true,
        tagList: [],
        videoPlay: true,
        click: false
    });
    const [values, setValues] = useState({
        isOur: true,
        expandButtons: true,
        playList: [],
        opponentTeamId: -1,
        selectAll: false,
        clickEventName: ''
    });
    const [gameTime, setGameTime] = useState({
        period: 'H1',
        time: 0,
        home_team_goals: 0,
        away_team_goals: 0,
        home_team_image: '',
        away_team_image: ''
    });
    const [tagIndex, setTagIndex] = useState('');
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [exportHudl, setExportHudl] = useState(false);
    const [exportEditOpen, setExportEditOpen] = useState(false);
    const [exportList, setExportList] = useState([]);
    const [gameList, setGameList] = useState([]);

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
        setGameTime({ ...gameTime, period: 'H1', time: 0, home_team_goals: 0, away_team_goals: 0, home_team_image: '', away_team_image: '' });
        setMenuAnchorEl(e.currentTarget);
    };

    const handleExpandButtons = () => {
        setValues({ ...values, expandButtons: !values.expandButtons });
    };

    const handleClickView = () => {
        setMenuAnchorEl(null);
        setValues({ ...values, clickEventName: '' });
        setLoadData(true);
    };

    const handleClickHudlFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        setExportList(newList);
        setExportHudl(true);
    };

    const handleClickHudlFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'sportcode' });
            setLoadData(true);
        } else {
            setExportList(values.playList);
            setExportHudl(true);
        }
    };

    const handleClickRenderFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'render' });
            setLoadData(true);
        } else gameCreateCommand(values.playList, tagIndex, gameList, gameIds);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);
        const ids = newList.map((item) => item.game_id);
        const newVideos = games.filter((game) => ids.includes(game.id) === true);

        gameCreateCommand(newList, tagIndex, newVideos, ids);
    };

    const handleClickEditFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length > 0) {
            setExportList(values.playList);
            setExportEditOpen(true);
        } else {
            setValues({ ...values, clickEventName: 'my_edits' });
            setLoadData(true);
        }
    };

    const handleClickEditFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        setExportList(newList);
        setExportEditOpen(true);
    };

    const handleShowVideo = (index) => {
        setCurTeamTagIdx(index);
        setVideoData({ ...videoData, idx: index, click: !videoData.click });
    };

    const handleCheckChange = (idx) => (e) => {
        setCheckArray({ ...checkArray, [idx]: e.target.checked });
    };

    const getTime = (time, delta) => {
        const items = time.split(':');
        const changedTime = parseInt(items[0]) * 3600 + parseInt(items[1]) * 60 + parseInt(items[2]) + delta;
        let hour = Math.floor(changedTime / 3600);
        let minute = Math.floor((changedTime - hour * 3600) / 60);
        let second = changedTime - hour * 3600 - minute * 60;

        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;

        return hour + ':' + minute + ':' + second;
    };

    const handleChangeTime = (index, isStart, direction) => {
        let array = [...values.playList];
        let data = [...videoData.tagList];

        if (isStart) {
            const changed = getTime(array[index].team_tag_start_time, direction);

            array[index].team_tag_start_time = changed;
            data[index].start_time = changed;
        } else {
            const changed = getTime(array[index].team_tag_end_time, direction);

            array[index].team_tag_end_time = changed;
            data[index].end_time = changed;
        }

        setValues({ ...values, playList: array });
        setVideoData({ ...videoData, tagList: data });
    };

    const changeGameTime = (array, idx) => {
        setGameTime({
            ...gameTime,
            period: getPeriod(array[idx].period),
            time: array[idx].time_in_game,
            home_team_goals: array[idx].home_team_goal ?? 0,
            away_team_goals: array[idx].away_team_goal ?? 0,
            home_team_image: array[idx].home_team_logo ?? '',
            away_team_image: array[idx].away_team_logo ?? ''
        });
    };

    const getPlayTagList = (func) => {
        func.then((res) => {
            setLoading(false);
            setLoadData(false);

            if (values.clickEventName === 'render') gameCreateCommand(res, tagIndex, gameList, gameIds);
            else if (values.clickEventName === 'sportcode') {
                setExportList(res);
                setExportHudl(true);
            } else if (values.clickEventName === 'my_edits') {
                setExportList(res);
                setExportEditOpen(true);
            } else {
                setVideoData({
                    ...videoData,
                    idx: 0,
                    tagList: res
                });
                setValues({ ...values, playList: res });
                changeGameTime(res, 0);
                setCheckArray([]);
                res.map((item, index) => {
                    setCheckArray((oldRows) => [...oldRows, false]);
                });
            }
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
            } else if (tagIndex === 'Build Up Goalkeeper') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeper(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Build Up Own Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Build Up Opponent Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(teamId, gameIds.join(',')));
                else getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(teamId, gameIds.join(',')));
            } else if (tagIndex === 'Started From Goalkeeper') {
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
            } else if (tagIndex === 'Chances') {
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

    useEffect(() => {
        if (values.playList.length > 0) changeGameTime(values.playList, curTeamTagIdx);
    }, [curTeamTagIdx]);

    useEffect(() => {
        setGameList(games.filter((item) => gameIds.includes(item.id)));
    }, [games, gameIds]);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '85vh', minHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', minWidth: '550px', flexDirection: 'column', padding: '16px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <GameOverviewHeader isOur={values.isOur} ourname={teamname} enemyname={t('Opponents')} onChangeTeam={handleChangeTeam} mb="0" />
                </Box>
                {values.expandButtons && <GameTagButtonList t={t} selectedTag={tagIndex} onShow={handleShowPopover} isTeams={true} />}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, height: '1px', background: 'black' }} />
                    <Box sx={{ 'svg path': { fill: 'black' }, cursor: 'pointer' }} onClick={handleExpandButtons}>
                        <UpIcon sx={{ transform: values.expandButtons ? '' : 'rotate(180deg)' }} />
                    </Box>
                </Box>
                <GameTagMenu
                    t={t}
                    anchor={menuAnchorEl}
                    onClose={() => setMenuAnchorEl(null)}
                    onView={handleClickView}
                    onHudl={handleClickHudlFromMenu}
                    onRender={handleClickRenderFromMenu}
                    onEdits={handleClickEditFromMenu}
                />
                {values.playList.length > 0 && (
                    <GameTagControlSection
                        t={t}
                        clipCount={values.playList.length}
                        isSelectAll={values.selectAll}
                        onAll={(e) => setValues({ ...values, selectAll: e.target.checked })}
                        onHudl={handleClickHudlFromButton}
                        onRender={handleClickRenderFromButton}
                        onEdits={handleClickEditFromButton}
                    />
                )}
                <GameTagList
                    t={t}
                    isLoading={loading}
                    expand={values.expandButtons}
                    tagList={values.playList}
                    curTagListIdx={curTeamTagIdx}
                    checkArr={checkArray}
                    onChecked={handleCheckChange}
                    onVideo={handleShowVideo}
                    onTime={handleChangeTime}
                />
            </Box>
            <TeamVideoPlayer t={t} videoData={videoData} games={games} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} gameTime={gameTime} isTeams={true} />
            <GameExportToEdits t={t} open={exportEditOpen} onClose={() => setExportEditOpen(false)} tagList={exportList} isTeams={true} />
            {exportHudl && <XmlDataFilterTeamOverview games={gameList} tagList={exportList} isOur={values.isOur} tag_name={tagIndex} team_name={teamname} setExportXML={setExportHudl} />}
        </Box>
    );
};

export default TeamOverview;
