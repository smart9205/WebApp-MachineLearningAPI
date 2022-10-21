import { Typography } from '@mui/material';
import React from 'react';

import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import '../coach_style.css';

const LeadersPlayerStatItem = ({ player, option, isTotal, onShow }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100px', padding: '16px 8px', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => onShow(player)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '88px', height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={player.image_url ? player.image_url : PLAYER_ICON_DEFAULT} style={{ height: '100%', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '2px' }}>
                    <p className="normal-text">{player.player_name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <p className="normal-text">{`#${player.player_jersey_number}`}</p>
                        <p className="normal-text">{player.player_position}</p>
                    </div>
                    <p className="normal-text">{player.team_name}</p>
                </div>
            </div>
            <p className="bigger-text">{isTotal ? player[`total_${option}`] : player[`average_${option}`]}</p>
        </div>
    );
};

export default LeadersPlayerStatItem;
