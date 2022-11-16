import { Box } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import GameService from '../../../../../services/game.service';
import { gamePlayerCreateCommand } from '../../../components/utilities';
import { XmlDataFilterGamePlayer } from '../../../components/xmldata';
import { ActionData } from '../../../components/common';
import GamePlayerTagList from './tagList';
import GameTagControlSection from '../overview/tagControlSection';
import GameTagMenu from '../overview/tagMenu';
import GameOverviewHeader from '../overview/header';
import GamePlayerTagButtonList from './tagButtonList';
import GamePlayerLogoList from './playerLogoList';
import GameExportToEdits from '../overview/exportEdits';
import { getPeriod } from '../overview/tagListItem';
import GameVideoPlayer from '../../gameVideoPlayer';

const GamePlayers = ({ game }) => {
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
    const [gameTime, setGameTime] = useState({
        period: 'H1',
        time: 0,
        video_url: '',
        home_team_goals: 0,
        away_team_goals: 0,
        home_team_image: '',
        away_team_image: ''
    });
    const [tagIndex, setTagIndex] = useState({});
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [exportHudl, setExportHudl] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [playerIds, setPlayerIds] = useState([]);
    const [exportEditOpen, setExportEditOpen] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex({});
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
        } else gamePlayerCreateCommand(values.playList, tagIndex.name, [game], [game.id]);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        gamePlayerCreateCommand(newList, tagIndex.name, [game], [game.id]);
    };

    const handleClickEditsFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        setPlayerTagList(newList);
        setExportEditOpen(true);
    };

    const handleClickEditsFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'my_edits' });
            setLoadData(true);
        } else {
            setPlayerTagList(values.playList);
            setExportEditOpen(true);
        }
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
            const changed = getTime(array[index].player_tag_start_time, direction);

            array[index].player_tag_start_time = changed;
            data[index].start_time = changed;
        } else {
            const changed = getTime(array[index].player_tag_end_time, direction);

            array[index].player_tag_end_time = changed;
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
            console.log('Game/Overview => ', res);
            setLoading(false);
            setLoadData(false);

            if (values.clickEventName === 'render') gamePlayerCreateCommand(res, tagIndex.name, [game], [game.id]);
            else if (values.clickEventName === 'sportcode') {
                setPlayerTagList(res);
                setExportHudl(true);
            } else if (values.clickEventName === 'my_edits') {
                setPlayerTagList(res);
                setExportEditOpen(true);
            } else {
                setVideoData({
                    ...videoData,
                    idx: 0,
                    tagList: res.map((item) => {
                        return {
                            start_time: item.player_tag_start_time,
                            end_time: item.player_tag_end_time,
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
            getPlayTagList(
                GameService.getGamePlayerTags(
                    currentUser.id,
                    values.isOur ? values.teamId : values.opponentTeamId,
                    playerIds.length === 0 ? null : playerIds.join(','),
                    `${game.id}`,
                    ActionData[tagIndex.id].action_id,
                    ActionData[tagIndex.id].action_type_id,
                    ActionData[tagIndex.id].action_result_id
                )
            );
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

    console.log('GamePlayer => ', values.playList, playerIds);
    // console.log(`GamePlayer => ${values.teamId}, ${values.opponentTeamId}`);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '24px 10px' }}>
                <GameOverviewHeader
                    isOur={values.isOur}
                    ourname={values.teamId === game.away_team_id ? game.away_team_name : game.home_team_name}
                    enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    onChangeTeam={handleChangeTeam}
                    mb="8px"
                />
                <GamePlayerLogoList game={game} teamId={values.teamId} opponent={values.opponentTeamId} our={values.isOur} setIds={setPlayerIds} />
                {values.expandButtons && <GamePlayerTagButtonList selectedTag={tagIndex} onShow={handleShowPopover} />}
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
                    onEdits={handleClickEditsFromMenu}
                />
                {values.playList.length > 0 && (
                    <GameTagControlSection
                        clipCount={values.playList.length}
                        isSelectAll={values.selectAll}
                        onAll={(e) => setValues({ ...values, selectAll: e.target.checked })}
                        onHudl={handleClickHudlFromButton}
                        onRender={handleClickRenderFromButton}
                        onEdits={handleClickEditsFromButton}
                    />
                )}
                <GamePlayerTagList
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
            {exportHudl && <XmlDataFilterGamePlayer game={game} tagList={playerTagList} isOur={values.isOur} tag_name={tagIndex.name} setExportXML={setExportHudl} />}
            <GameExportToEdits open={exportEditOpen} onClose={() => setExportEditOpen(false)} tagList={playerTagList} isTeams={false} />
        </Box>
    );
};

export default GamePlayers;
