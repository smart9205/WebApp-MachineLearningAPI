import { Box } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import GameService from '../../../../../services/game.service';
import { gamePlayerCreateCommand } from '../../../components/utilities';
import GamePlayerTagList from '../../../games/tabs/players/tagList';
import GameTagControlSection from '../../../games/tabs/overview/tagControlSection';
import GameTagMenu from '../../../games/tabs/overview/tagMenu';
import GamePlayerTagButtonList from '../../../games/tabs/players/tagButtonList';
import GameExportToEdits from '../../../games/tabs/overview/exportEdits';
import { getPeriod } from '../../../games/tabs/overview/tagListItem';
import TeamVideoPlayer from '../overview/teamVideoPlayer';
import TeamPlayerLogoList from './playerLogoList';
import { ActionData } from '../../../components/common';
import { XmlDataFilterTeamPlayer } from '../../../components/xmldatateam';

const TeamPlayersOverview = ({ games, gameIds, teamId, teamName, t }) => {
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
    const [tagIndex, setTagIndex] = useState({});
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [playerIds, setPlayerIds] = useState([]);
    const [exportEditOpen, setExportEditOpen] = useState(false);
    const [gameList, setGameList] = useState([]);
    const [exportXML, setExportXML] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleShowPopover = (idx) => (e) => {
        if (gameIds.length === 0) {
            window.alert("No selected games. Please click 'Select Games' button to select.");

            return;
        }

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
        setExportXML(true);
    };

    const handleClickHudlFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'sportcode' });
            setLoadData(true);
        } else {
            setPlayerTagList(values.playList);
            setExportXML(true);
        }
    };

    const handleClickRenderFromMenu = () => {
        setMenuAnchorEl(null);

        if (values.playList.length === 0) {
            setValues({ ...values, clickEventName: 'render' });
            setLoadData(true);
        } else gamePlayerCreateCommand(values.playList, tagIndex.name, gameList, gameIds);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        gamePlayerCreateCommand(newList, tagIndex.name, gameList, gameIds);
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

            if (values.clickEventName === 'render') gamePlayerCreateCommand(res, tagIndex.name, gameList, gameIds);
            else if (values.clickEventName === 'sportcode') {
                setPlayerTagList(res);
                setExportXML(true);
            } else if (values.clickEventName === 'my_edits') {
                setPlayerTagList(res);
                setExportEditOpen(true);
            } else {
                setVideoData({
                    ...videoData,
                    idx: 0,
                    tagList: res
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
        if (gameIds.length > 0) {
            setGameList(games.filter((item) => gameIds.includes(item.id)));

            if (loadData) {
                setLoading(true);
                setValues({ ...values, playList: [] });
                setVideoData({ ...videoData, tagList: [] });
                getPlayTagList(
                    GameService.getGamePlayerTags(
                        currentUser.id,
                        teamId,
                        playerIds.length === 0 ? null : playerIds.join(','),
                        gameIds.join(','),
                        ActionData[tagIndex.id].action_id,
                        ActionData[tagIndex.id].action_type_id,
                        ActionData[tagIndex.id].action_result_id,
                        null,
                        null,
                        null,
                        null,
                        null
                    )
                );
            }
        } else {
            setGameList([]);
            setValues({ ...values, playList: [] });
            setVideoData({ ...videoData, tagList: [] });
        }
    }, [tagIndex, loadData, gameIds]);

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
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px 10px' }}>
                <TeamPlayerLogoList t={t} games={games} gameIds={gameIds} teamId={teamId} setIds={setPlayerIds} />
                {values.expandButtons && <GamePlayerTagButtonList t={t} selectedTag={tagIndex} onShow={handleShowPopover} />}
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
                    onEdits={handleClickEditsFromMenu}
                />
                {values.playList.length > 0 && (
                    <GameTagControlSection
                        t={t}
                        clipCount={values.playList.length}
                        isSelectAll={values.selectAll}
                        onAll={(e) => setValues({ ...values, selectAll: e.target.checked })}
                        onHudl={handleClickHudlFromButton}
                        onRender={handleClickRenderFromButton}
                        onEdits={handleClickEditsFromButton}
                    />
                )}
                <GamePlayerTagList
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
            <TeamVideoPlayer t={t} videoData={videoData} games={games} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} gameTime={gameTime} isTeams={false} />
            <GameExportToEdits t={t} open={exportEditOpen} onClose={() => setExportEditOpen(false)} tagList={playerTagList} isTeams={false} />
            {exportXML && <XmlDataFilterTeamPlayer games={gameList} tagList={playerTagList} tag_name={tagIndex.name} team_name={teamName} setExportXML={setExportXML} />}
        </Box>
    );
};

export default TeamPlayersOverview;
