import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import '../../../coach_style.css';
import { getComparator, stableSort } from '../../../components/utilities';

const GameStatsChart = ({ chartId, title, isType, action_results, list, filterText, game }) => {
    const [playerList, setPlayerList] = useState([]);
    const [hoverId, setHoverId] = useState('');
    const [videoOpen, setVideoOpen] = useState(false);
    const [playData, setPlayData] = useState({ url: '', list: [] });

    const getBarWidth = (maxCount, count) => {
        const realWidth = Math.floor((count * 95) / maxCount);

        return `${realWidth}%`;
    };

    const handleMouseEnter = (index, sId) => {
        setHoverId(`${chartId}-${index}-${sId}`);
    };

    const getChartBarId = (index, sId) => {
        return `${chartId}-${index}-${sId}`;
    };

    const handleDisplayVideo = () => {
        setVideoOpen(true);
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
                        const count = includedData.filter((res) => (isType ? name === res.action_type_names : name === res.action_result_names)).length;

                        includedFilterList = [...includedFilterList, { name: name, count: count, color: action_results[results.indexOf(name)].color }];

                        return includedFilterList;
                    }
                });

                temp = [...temp, { name: item.player_names, count: includedData.length, data: includedFilterList }];
            }

            return temp;
        });

        setPlayerList(stableSort(temp, getComparator('desc', 'count')));
    }, [list, filterText]);

    console.log('chart => ', playerList);

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
                        <div id={`newcoach_chart-bar-${chartId}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '70%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
                                {item.data.map((skill, sId) => (
                                    <div
                                        key={`${index}-${sId}`}
                                        style={{
                                            background: skill.color,
                                            width: getBarWidth(playerList[0].count, skill.count),
                                            height: '20px',
                                            cursor: 'pointer',
                                            border: hoverId === getChartBarId(index, sId) ? '1px solid white' : 'none'
                                        }}
                                        onMouseEnter={() => handleMouseEnter(index, sId)}
                                        onMouseLeave={() => setHoverId('')}
                                        onClick={() => handleDisplayVideo()}
                                    >
                                        <p className="chart-bar-text">{skill.count}</p>
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
        </Box>
    );
};

export default GameStatsChart;
