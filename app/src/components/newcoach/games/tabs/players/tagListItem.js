import React from 'react';
import { Box, Typography } from '@mui/material';

import MinusIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddIcon from '@mui/icons-material/AddBox';

const GamePlayerTagListItem = ({ item, isSelected, idx, isChecked, onChecked, onShowVideo, onChangeTime }) => {
    const getPeriod = (id) => {
        return id === 1 ? 'H1' : id === 2 ? 'H2' : 'OT';
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '8px',
                padding: '4px',
                justifyContent: 'space-between',
                border: '1px solid #e8e8e8',
                borderRadius: '8px'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => onShowVideo(idx)}>
                <Box
                    sx={{
                        background: isSelected ? '#0A7304' : '#C5EAC6',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'white' }}>{idx + 1}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>
                            {`${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names} - ${item.action_names} - ${item.action_type_names} - ${item.action_result_names}`}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{`${item.home_team_name} VS ${item.away_team_name}`}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.game_date}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '115px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box onClick={() => onChangeTime(idx, true, -5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <MinusIcon fontSize="small" />
                        </Box>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.player_tag_start_time}</Typography>
                        <Box onClick={() => onChangeTime(idx, true, 5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <AddIcon fontSize="small" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box onClick={() => onChangeTime(idx, false, -5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <MinusIcon fontSize="small" />
                        </Box>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.player_tag_end_time}</Typography>
                        <Box onClick={() => onChangeTime(idx, false, 5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <AddIcon fontSize="small" />
                        </Box>
                    </Box>
                </div>
                <input key={idx} type="checkbox" value={isChecked} checked={isChecked ? true : false} style={{ width: '18px', height: '18px' }} onChange={onChecked(idx)} />
            </Box>
        </Box>
    );
};

export default GamePlayerTagListItem;
