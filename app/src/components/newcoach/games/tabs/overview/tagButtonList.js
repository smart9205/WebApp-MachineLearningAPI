import React from 'react';
import { Box } from '@mui/material';

import GameTagButton from './tagButton';

const Tags = [
    'Game Highlight',
    'Clean Game',
    'All Offensive Possessions',
    'All Defensive Possessions',
    'Offensive Half Build Up',
    'Defensive Half Build Up',
    "Goalkeeper's Build Up",
    "Goalkeeper's Build Up (Kick)",
    'Counter-Attacks',
    'Started From Interception',
    'Started From Tackle',
    'Started From Throw In',
    'Goals',
    'Goal Opportunities',
    'Goal Kicks',
    'Free Kicks',
    'Crosses',
    'Corners',
    'Offsides',
    'Turnovers',
    'Draw Fouls',
    'Penalties Gained',
    'Saved',
    'Clearance',
    'Blocked'
];

const GameTagButtonList = ({ selectedTag, onShow }) => {
    return (
        <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                {Tags.slice(0, 12).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} />
                ))}
            </Box>
            <Box sx={{ width: '100%', height: '1px', background: 'black', margin: '2px 0' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                {Tags.slice(12, 25).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} />
                ))}
            </Box>
        </>
    );
};

export default GameTagButtonList;
