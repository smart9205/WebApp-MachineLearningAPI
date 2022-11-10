import { Box, Tooltip, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';

import '../../../coach_style.css';
import { getComparator, stableSort } from '../../../components/utilities';
import GameExportToEdits from '../../../games/tabs/overview/exportEdits';
import { getPeriod } from '../../../games/tabs/overview/tagListItem';
import TeamStatsVideoPlayer from './videoDialog';

const TeamStatsChart = ({ chartId, title, isType, action_results, list, filterText, games, teamId, refreshPage }) => {
    const [playerList, setPlayerList] = useState([]);
    const [hoverId, setHoverId] = useState('');
    const [videoOpen, setVideoOpen] = useState(false);
    const [playData, setPlayData] = useState([]);
    const [exportOpen, setExportOpen] = useState(false);

    const getBarWidth = (maxCount, count) => {
        const realWidth = Math.floor((count * 98) / maxCount);

        return `${realWidth}%`;
    };

    const handleMouseEnter = (index, sId) => {
        setHoverId(`${chartId}-${index}-${sId}`);
    };

    const getChartBarId = (index, sId) => {
        return `${chartId}-${index}-${sId}`;
    };

    const handleDisplayVideo = (player, sId) => {
        setPlayData(
            player.data[sId].videoList.map((item) => {
                return {
                    tag_id: item.id,
                    start_time: item.player_tag_start_time,
                    end_time: item.player_tag_end_time,
                    player_name: item.player_names,
                    action_name: item.action_names,
                    action_type: item.action_type_names,
                    action_result: item.action_result_names,
                    game_id: item.game_id,
                    team_id: teamId,
                    court_area: item.court_area_id,
                    inside_pain: item.inside_the_pain,
                    period: getPeriod(item.period),
                    time: item.time_in_game,
                    home_team_image: item.home_team_logo,
                    away_team_image: item.away_team_logo,
                    home_team_goals: item.home_team_goal,
                    away_team_goals: item.away_team_goal
                };
            })
        );
        setVideoOpen(true);
    };

    const handleExportTags = (player, sId) => (e) => {
        e.preventDefault();
        setPlayData(player.data[sId].videoList);
        setExportOpen(true);
    };

    const getTooltipContent = (player, sId) => {
        return (
            <div>
                <p className="normal-text-white">Name: {player.name}</p>
                <p className="normal-text-white">Action: {filterText}</p>
                <p className="normal-text-white">
                    {isType ? 'Type' : 'Result'}: {player.data[sId].name}
                </p>
                <p className="normal-text-white">Count: {player.data[sId].count}</p>
            </div>
        );
    };

    useEffect(() => {
        const filterList = list.filter((item) => item.action_names === filterText);
        const results = action_results.map((item) => item.title);
        let temp = [];

        filterList.map((item) => {
            const filtered = temp.filter((data) => item.player_names === data.name);

            if (filtered.length === 0) {
                const playerData = filterList.filter((data) => data.player_names === item.player_names);
                const includedData = playerData.filter((data) => results.includes(isType ? data.action_type_names : data.action_result_names));
                let includedFilterList = [];

                includedData.map((data) => {
                    const name = isType ? data.action_type_names : data.action_result_names;
                    const filt = includedFilterList.filter((res) => res.name === name);

                    if (filt.length === 0) {
                        const play = includedData.filter((res) => (isType ? name === res.action_type_names : name === res.action_result_names));

                        includedFilterList = [...includedFilterList, { name: name, count: play.length, color: action_results[results.indexOf(name)].color, videoList: play }];

                        return includedFilterList;
                    }
                });

                temp = [...temp, { name: item.player_names, count: includedData.length, data: includedFilterList }];
            }

            return temp;
        });

        setPlayerList(stableSort(temp, getComparator('desc', 'count')));
    }, [list, filterText]);

    console.log('chart => ', playData);

    return (
        <Box id={chartId} sx={{ width: '100%', height: '272px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="chart-title">{title}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {action_results.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <div style={{ background: `${item.color}`, borderRadius: '50%', width: '12px', height: '12px' }} />
                            <p className="normal-text-italic">{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '70%', overflowY: 'auto' }}>
                {playerList.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <p className="chart-primary-text" style={{ width: '30%' }}>
                            {item.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '70%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
                                {item.data.map((skill, sId) => (
                                    <div
                                        key={`${chartId}-${index}-${sId}`}
                                        style={{
                                            background: skill.color,
                                            width: getBarWidth(playerList[0].count, skill.count),
                                            height: '20px',
                                            cursor: 'pointer',
                                            border: hoverId === getChartBarId(index, sId) ? '1px solid white' : 'none'
                                        }}
                                        onMouseEnter={() => handleMouseEnter(index, sId)}
                                        onMouseLeave={() => setHoverId('')}
                                        onClick={() => handleDisplayVideo(item, sId)}
                                        onContextMenu={handleExportTags(item, sId)}
                                    >
                                        <Tooltip arrow title={getTooltipContent(item, sId)} TransitionComponent={Zoom} placement="right">
                                            <p className="chart-bar-text">{skill.count}</p>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                            <p className="normal-text-italic" style={{ textAlign: 'right' }}>
                                {item.count}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <TeamStatsVideoPlayer
                open={videoOpen}
                onClose={(flag) => {
                    setVideoOpen(false);

                    if (flag) refreshPage((r) => !r);
                }}
                video_url={games}
                tagList={playData}
            />
            <GameExportToEdits open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
        </Box>
    );
};

export default TeamStatsChart;
