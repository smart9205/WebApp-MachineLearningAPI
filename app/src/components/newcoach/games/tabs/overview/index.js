import { Box } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import GameService from '../../../../../services/game.service';
import { gameCreateCommand } from '../../../components/utilities';
import { XmlDataFilterGame } from '../../../components/xmldata';
import GameTagButtonList from './tagButtonList';
import GameTagList from './tagList';
import GameTagControlSection from './tagControlSection';
import GameTagMenu from './tagMenu';
import GameOverviewHeader from './header';
import GameExportToEdits from './exportEdits';
import GameVideoPlayer from '../../gameVideoPlayer';
import { getPeriod } from './tagListItem';

const GameOverview = ({ game }) => {
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
        teamId: -1,
        opponentTeamId: -1,
        selectAll: false,
        clickEventName: ''
    });
    const [tagIndex, setTagIndex] = useState('');
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [exportHudl, setExportHudl] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [exportEditOpen, setExportEditOpen] = useState(false);
    const [exportList, setExportList] = useState([]);
    const [gameTime, setGameTime] = useState({
        period: 'H1',
        time: 0,
        video_url: '',
        home_team_goals: 0,
        away_team_goals: 0,
        home_team_image: '',
        away_team_image: ''
    });

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex('');
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
            } else if (tagIndex === 'Build Up Goalkeeper') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildupGoalkeeper(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildupGoalkeeper(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Build Up Own Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildonDefensiveHalf(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Build Up Opponent Half') {
                if (values.isOur) getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(values.teamId, `${game.id}`));
                else getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(values.teamId, `${game.id}`));
            } else if (tagIndex === 'Started From Goalkeeper') {
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
            } else if (tagIndex === 'Chances') {
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

    useEffect(async () => {
        setLoading(true);
        await GameService.getAllMyCoachTeam().then((res) => {
            const filtered = res.filter(
                (item) => item.season_name === game.season_name && item.league_name === game.league_name && (item.team_id === game.home_team_id || item.team_id === game.away_team_id)
            );
            const team = filtered[0].team_id;
            const opponent = team === game.home_team_id ? game.away_team_id : game.home_team_id;

            setValues({ ...values, teamId: team, opponentTeamId: opponent });
            setGameTime({ ...gameTime, video_url: game.video_url });
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setCheckArray([]);
        values.playList.map((item, index) => {
            setCheckArray((oldRows) => [...oldRows, values.selectAll]);
        });
    }, [values.selectAll]);

    useEffect(() => {
        if (values.playList.length > 0) changeGameTime(values.playList, curTeamTagIdx);
    }, [curTeamTagIdx]);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', minWidth: '600px', flexDirection: 'column', padding: '24px 10px' }}>
                <GameOverviewHeader
                    isOur={values.isOur}
                    ourname={values.teamId === game.away_team_id ? game.away_team_name : game.home_team_name}
                    enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    onChangeTeam={handleChangeTeam}
                    mb="8px"
                />
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

export default GameOverview;
