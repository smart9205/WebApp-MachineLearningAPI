import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import '../../../coach_style.css';

let boxList = [
    [
        { id: 'goal', title: 'Goal', total: 0 },
        { id: 'shot', title: 'Shot', total: 0 },
        { id: 'pass', title: 'Pass', total: 0 }
        
    ],
    [
        { id: 'blocked', title: 'Blocked', total: 0 },
        { id: 'clearance', title: 'Clearance', total: 0 },
        { id: 'saved', title: 'Saved', total: 0 }
    ],  
    [
        { id: 'interception', title: 'Interception', total: 0 },
        { id: 'tackle', title: 'Tackle', total: 0 },
        { id: 'draw_fouls', title: 'Draw Foul', total: 0 }
  
    ]

];

const GameStatsBoxList = ({ list }) => {
    const [actionList, setActionList] = useState([]);

    useEffect(() => {
        let temp = [];

        boxList.map((row, rId) => {
            return row.map((item, cId) => {
                boxList[rId][cId].total = list.filter((stat) => stat.action_names === item.title).length;

                return boxList;
            });
        });
        list.map((item) => {
            const filtered = temp.filter((data) => data === item.action_names);

            if (filtered.length === 0) temp = [...temp, item.action_names];

            return temp;
        });
        boxList[0][0].total += list.filter((item) => item.action_names === 'Shot' && item.action_result_names === 'Goal').length;
        boxList[0][0].total += list.filter((item) => item.action_names === 'Own Goal' && item.action_result_names === 'Goal').length;
        setActionList(temp);
    }, [list]);

    console.log('game stats boxlist => ', boxList, actionList);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', paddingTop: '0px', paddingBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {boxList[0].map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1px solid #1A1B1D',
                            background: '#F2F7F2',
                            width: '120px',
                            height: '60px'
                        }}
                    >
                        <p className="normal-text">{item.title}</p>
                        <p className="normal-text">{item.total}</p>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {boxList[1].map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1px solid #1A1B1D',
                            background: '#F2F7F2',
                            width: '120px',
                            height: '60px'
                        }}
                    >
                        <p className="normal-text">{item.title}</p>
                        <p className="normal-text">{item.total}</p>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {boxList[2].map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1px solid #1A1B1D',
                            background: '#F2F7F2',
                            width: '120px',
                            height: '60px'
                        }}
                    >
                        <p className="normal-text">{item.title}</p>
                        <p className="normal-text">{item.total}</p>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default GameStatsBoxList;
