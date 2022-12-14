import React from 'react';
import { Box, Divider } from '@mui/material';

import GamePlayerTagButton from './tagButton';

const Tags = [
    { id: 'Goal', name: 'Goals' },
    { id: 'GoalOpportunity', name: 'Goal Opportunities' },
    { id: 'GoalKick', name: 'Goal Kicks' },
    { id: 'FreeKick', name: 'Free Kicks' },
    { id: 'KeyPass', name: 'Key Passes' },
    { id: 'ThroughPass', name: 'Through Passes' },
    { id: 'Cross', name: 'Crosses' },
    { id: 'Dribble', name: 'Dribbles' },
    { id: 'Offside', name: 'Offsides' },
    { id: 'Corner', name: 'Corners' },
    { id: 'DrawFoul', name: 'Draw Fouls' },
    { id: 'Turnover', name: 'Turnovers' },
    { id: 'Saved', name: 'Saved' },
    { id: 'Penalty', name: 'Penalties Gained' },
    { id: 'Blocked', name: 'Blocked' },
    { id: 'Clearance', name: 'Clearance' },
    { id: 'Interception', name: 'Interceptions' },
    { id: 'Tackle', name: 'Tackles' },
    { id: 'Foul', name: 'Fouls' },
    { id: 'All', name: 'All Actions' }
];

const GamePlayerTagButtonList = ({ selectedTag, onShow, t }) => {
    return (
        <>
            <Divider sx={{ width: '100%', backgroundColor: 'black', opacity: 1, border: 'none', margin: '8px 0 2px' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '0px' }}>
                {Tags.map((tag, index) => (
                    <GamePlayerTagButton t={t} key={index} isSelected={selectedTag === tag} tag={tag} onShow={onShow} />
                ))}
            </Box>
        </>
    );
};

export default GamePlayerTagButtonList;
