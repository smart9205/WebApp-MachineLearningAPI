import { Typography } from '@mui/material';
import React from 'react';

import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

const LeadersPlayerStatItem = ({ player, option, isTotal, onShow }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '120px', padding: '16px 8px', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => onShow(player)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '88px', height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={player.image_url ? player.image_url : PLAYER_ICON_DEFAULT} style={{ height: '100%', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '2px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 500, color: '#1a1b1d' }}>{player.player_name}</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{`#${player.player_jersey_number}`}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{player.player_position}</Typography>
                    </div>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{player.team_name}</Typography>
                </div>
            </div>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 700, color: '#1a1b1d', padding: '16px 0' }}>
                {isTotal ? player[`total_${option}`] : player[`average_${option}`]}
            </Typography>
        </div>
    );
};

export default LeadersPlayerStatItem;
