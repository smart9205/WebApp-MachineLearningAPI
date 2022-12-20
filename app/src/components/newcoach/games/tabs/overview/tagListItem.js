import React from 'react';
import { Box } from '@mui/material';

import MinusIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddIcon from '@mui/icons-material/AddBox';

export function getPeriod(id) {
    return id === 1 ? 'H1' : id === 2 ? 'H2' : 'OT';
}

const GameTagListItem = ({ item, isSelected, idx, isChecked, onChecked, onShowVideo, onChangeTime }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: '0px',
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
                    <p className="normal-text">{idx + 1}</p>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <p className="normal-text">{`${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names} - `}</p>
                        <p className="normal-text">{`${item.action_names} - ${item.action_type_names} - ${item.action_result_names}`}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <p className="normal-text">{`${item.home_team_name} vs ${item.away_team_name}`}</p>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box onClick={() => onChangeTime(idx, true, -5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <MinusIcon fontSize="small" />
                        </Box>
                        <p className="normal-text">{item.team_tag_start_time}</p>
                        <Box onClick={() => onChangeTime(idx, true, 5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <AddIcon fontSize="small" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box onClick={() => onChangeTime(idx, false, -5)} sx={{ 'svg path': { fill: 'lightgrey' } }}>
                            <MinusIcon fontSize="small" />
                        </Box>
                        <p className="normal-text">{item.team_tag_end_time}</p>
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

export default GameTagListItem;
