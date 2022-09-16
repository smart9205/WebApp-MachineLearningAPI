import { Box } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import VideoPlayer from '../../../../coach/VideoPlayer';
import GameService from '../../../../../services/game.service';
import { gamePlayerCreateCommand } from '../../../components/utilities';
import { XmlDataFilterGamePlayer } from '../../../components/xmldata';
import GamePlayerTagList from './tagList';
import GameTagControlSection from '../overview/tagControlSection';
import GameTagMenu from '../overview/tagMenu';
import GameOverviewHeader from '../overview/header';
import GamePlayerTagButtonList from './tagButtonList';
import GamePlayerLogoList from './playerLogoList';

const ActionData = {
    Goal: { action_id: '1', action_type_id: null, action_result_id: '3' },
    GoalOpportunity: { action_id: '1', action_type_id: null, action_result_id: '1' },
    GoalKick: { action_id: '1', action_type_id: null, action_result_id: null },
    FreeKick: { action_id: '1,2,3', action_type_id: '11,13', action_result_id: null },
    KeyPass: { action_id: '2', action_type_id: '7', action_result_id: null },
    ThroughPass: { action_id: '2', action_type_id: '6', action_result_id: null },
    Cross: { action_id: '3', action_type_id: '1,2,3,4,5,6,7,8,9,10,13,14,15', action_result_id: null },
    Dribble: { action_id: '4', action_type_id: null, action_result_id: null },
    Offside: { action_id: '7', action_type_id: null, action_result_id: '15' },
    Corner: { action_id: '2,3', action_type_id: '12', action_result_id: null },
    DrawFoul: { action_id: '6', action_type_id: null, action_result_id: null },
    Turnover: { action_id: '2,7', action_type_id: null, action_result_id: '5,11,12,15' },
    Saved: { action_id: '8', action_type_id: null, action_result_id: null },
    Penalty: { action_id: '4', action_type_id: null, action_result_id: '14' },
    Blocked: { action_id: '13', action_type_id: null, action_result_id: '7,19' },
    Clearance: { action_id: '11', action_type_id: null, action_result_id: null },
    Interception: { action_id: '10', action_type_id: null, action_result_id: null },
    Tackle: { action_id: '12', action_type_id: null, action_result_id: null },
    Foul: { action_id: '5', action_type_id: null, action_result_id: null },
    All: { action_id: null, action_type_id: null, action_result_id: null }
};

const GamePlayers = ({ game }) => {
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
    const [tagIndex, setTagIndex] = useState({});
    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkArray, setCheckArray] = useState([]);
    const [exportHudl, setExportHudl] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [playerIds, setPlayerIds] = useState([]);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playList: [] });
        setVideoData({ ...videoData, idx: 0, tagList: [] });
        setTagIndex({});
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
        } else gamePlayerCreateCommand(values.playList, tagIndex.name, [game.video_url], [game.id]);
    };

    const handleClickRenderFromButton = () => {
        const newList = values.playList.filter((item, index) => checkArray[index] === true);

        gamePlayerCreateCommand(newList, tagIndex.name, [game.video_url], [game.id]);
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
                        start_time: item.player_tag_start_time,
                        end_time: item.player_tag_end_time
                    };
                })
            });

            if (values.clickRender) gamePlayerCreateCommand(res, tagIndex.name, [game.video_url], [game.id]);
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
            getPlayTagList(
                GameService.getGamePlayerTags(
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
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setCheckArray([]);
        values.playList.map((item, index) => {
            setCheckArray((oldRows) => [...oldRows, values.selectAll]);
        });
    }, [values.selectAll]);

    console.log('GamePlayer => ', values.playList, playerIds);
    // console.log(`GamePlayer => ${values.teamId}, ${values.opponentTeamId}`);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
                <GameOverviewHeader
                    isOur={values.isOur}
                    ourname={values.teamId === game.away_team_id ? game.away_team_name : game.home_team_name}
                    enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    onChangeTeam={handleChangeTeam}
                    mb="8px"
                />
                <GamePlayerLogoList game={game} teamId={values.teamId} our={values.isOur} setIds={setPlayerIds} />
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
            <VideoPlayer videoData={videoData} url={game.video_url ?? ''} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={true} isSpecial={true} />
            {exportHudl && <XmlDataFilterGamePlayer game={game} tagList={playerTagList} isOur={values.isOur} tag_name={tagIndex.name} setExportXML={setExportHudl} />}
        </Box>
    );
};

export default GamePlayers;