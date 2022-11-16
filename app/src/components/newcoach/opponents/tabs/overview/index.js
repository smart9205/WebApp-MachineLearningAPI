import { Box } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import GameService from '../../../../../services/game.service';
import { gameCreateCommand } from '../../../components/utilities';
import { XmlDataFilterGame } from '../../../components/xmldata';
import GameTagButtonList from '../../../games/tabs/overview/tagButtonList';
import GameTagList from '../../../games/tabs/overview/tagList';
import GameTagControlSection from '../../../games/tabs/overview/tagControlSection';
import GameTagMenu from '../../../games/tabs/overview/tagMenu';
import GameOverviewHeader from '../../../games/tabs/overview/header';
import GameExportToEdits from '../../../games/tabs/overview/exportEdits';
import { getPeriod } from '../../../games/tabs/overview/tagListItem';
import GameVideoPlayer from '../../../games/gameVideoPlayer';

const OpponentOverview = ({ game }) => {
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
        selectAll: false,
        clickEventName: ''
    });
    const [gameTime, setGameTime] = useState({
        period: 'H1',
        time: 0,
        video_url: '',
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
    const [playerTagList, setPlayerTagList] = useState([]);
    const [exportEditOpen, setExportEditOpen] = useState(false);
    const [exportList, setExportList] = useState([]);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex(-1);
    };

    const handleShowPopover = (idx) => (e) => {
        setTagIndex(idx);
        setGameTime({ ...gameTime, period: 'H1', time: 0, home_team_goals: 0, away_team_goals: 0, home_team_image: '', away_team_image: '' });
        setMenuAnchorEl(e.currentTarget);
    };

    const handleClickView = () => {
        setMenuAnchorEl(null);
        setValues({ ...values, clickEventName: '' });
        setLoadData(true);
    };

    const handleClickHudlFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        setPlayerTagList(newList);
        setExportHudl(true);
    };

    const handleClickHudlFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'sportcode' });
            setLoadData(true);
        } else {
            setPlayerTagList(values.playList);
            setExportHudl(true);
        }
    };

    const handleClickRenderFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'render' });
            setLoadData(true);
        } else gameCreateCommand(values.playList, tagIndex, [game], [game.id]);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        gameCreateCommand(newList, tagIndex, [game], [game.id]);
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

    const handleExpandButtons = () => {
        setValues({ ...values, expandButtons: !values.expandButtons });
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
            home_team_goals: array[idx].home_team_goal ?? undefined,
            away_team_goals: array[idx].away_team_goal ?? undefined,
            home_team_image: array[idx].home_team_logo ?? undefined,
            away_team_image: array[idx].away_team_logo ?? undefined
        });
    };

    const getPlayTagList = (func) => {
        func.then((res) => {
            setLoading(false);
            setLoadData(false);

            if (values.clickEventName === 'render') gameCreateCommand(res, tagIndex, [game], [game.id]);
            else if (values.clickEventName === 'sportcode') {
                setPlayerTagList(res);
                setExportHudl(true);
            } else if (values.clickEventName === 'my_edits') {
                setExportList(res);
                setExportEditOpen(true);
            } else {
                setVideoData({
                    ...videoData,
                    idx: 0,
                    tagList: res.map((item) => {
                        return {
                            start_time: item.team_tag_start_time,
                            end_time: item.team_tag_end_time,
                            name: `${item.player_names} - ${item.action_names} - ${item.action_type_names} - ${item.action_result_names}`
                        };
                    })
                });
                setValues({ ...values, playList: res });
                setCheckArray([]);
                res.map((item, index) => {
                    setCheckArray((oldRows) => [...oldRows, false]);
                });

                if (res.length > 0) changeGameTime(res, 0);
            }
        });
    };

    useEffect(() => {
        if (loadData) {
            setLoading(true);
            setValues({ ...values, playList: [] });
            setVideoData({ ...videoData, tagList: [] });

            if (tagIndex === 'Game Highlight') {
                getPlayTagList(GameService.getGameHighlight(values.isOur ? game.home_team_id : game.away_team_id, `${game.id}`));
            } else if (tagIndex === 'Clean Game') {
                getPlayTagList(GameService.getCleanGame(values.isOur ? game.home_team_id : game.away_team_id, `${game.id}`));
            } else if (tagIndex === 'All Offensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffensivePossession(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffensivePossession(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'All Defensive Possessions') {
                if (values.isOur) getPlayTagList(GameService.getTeamDefensivePossession(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentDefensivePossession(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Goals') {
                if (values.isOur) getPlayTagList(GameService.getTeamGoals(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentGoals(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Build Up Goalkeeper') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeper(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Build Up Own Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Build Up Opponent Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Started From Goalkeeper') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeperKick(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeperKick(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Started From Interception') {
                if (values.isOur) getPlayTagList(GameService.getTeamInterception(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentInterception(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Started From Tackle') {
                if (values.isOur) getPlayTagList(GameService.getTeamTackle(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentTackle(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Counter-Attacks') {
                if (values.isOur) getPlayTagList(GameService.getTeamCounterAttack(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCounterAttack(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Started From Throw In') {
                if (values.isOur) getPlayTagList(GameService.getTeamThrowIn(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentThrowIn(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Chances') {
                if (values.isOur) getPlayTagList(GameService.getTeamShots(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentShots(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Free Kicks') {
                if (values.isOur) getPlayTagList(GameService.getTeamFreekick(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentFreekick(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Corners') {
                if (values.isOur) getPlayTagList(GameService.getTeamCorner(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCorner(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Crosses') {
                if (values.isOur) getPlayTagList(GameService.getTeamCross(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentCross(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Penalties Gained') {
                if (values.isOur) getPlayTagList(GameService.getTeamPenalty(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentPenalty(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Draw Fouls') {
                if (values.isOur) getPlayTagList(GameService.getTeamDrawfoul(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentDrawfoul(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Offsides') {
                if (values.isOur) getPlayTagList(GameService.getTeamOffside(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentOffside(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Turnovers') {
                if (values.isOur) getPlayTagList(GameService.getTeamTurnover(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentTurnover(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Saved') {
                if (values.isOur) getPlayTagList(GameService.getTeamSaved(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentSaved(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Clearance') {
                if (values.isOur) getPlayTagList(GameService.getTeamClearance(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentClearance(game.home_team_id, `${game.id}`));
            } else if (tagIndex === 'Blocked') {
                if (values.isOur) getPlayTagList(GameService.getTeamBlocked(game.home_team_id, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBlocked(game.home_team_id, `${game.id}`));
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
        setGameTime({ ...gameTime, video_url: game.video_url });
    }, []);

    console.log('GameOverview => ', values.playList[0]);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', maxWidth: '600px', flexDirection: 'column', padding: '24px 10px' }}>
                <GameOverviewHeader isOur={values.isOur} ourname={game.home_team_name} enemyname={game.away_team_name} onChangeTeam={handleChangeTeam} mb="8px" />
                {values.expandButtons && <GameTagButtonList selectedTag={tagIndex} onShow={handleShowPopover} isTeams={false} />}
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
                    onEdits={handleClickEditFromMenu}
                />
                {values.playList.length > 0 && (
                    <GameTagControlSection
                        clipCount={values.playList.length}
                        isSelectAll={values.selectAll}
                        onAll={(e) => setValues({ ...values, selectAll: e.target.checked })}
                        onHudl={handleClickHudlFromButton}
                        onRender={handleClickRenderFromButton}
                        onEdits={handleClickEditFromButton}
                    />
                )}
                <GameTagList
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
            <GameVideoPlayer videoData={videoData} game={gameTime} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} />
            {exportHudl && <XmlDataFilterGame game={game} tagList={playerTagList} isOur={values.isOur} tag_name={tagIndex} setExportXML={setExportHudl} />}
            <GameExportToEdits open={exportEditOpen} onClose={() => setExportEditOpen(false)} tagList={exportList} isTeams={true} />
        </Box>
    );
};

export default OpponentOverview;
