import React from 'react';
import { Box, Divider } from '@mui/material';

import GameTagButton from './tagButton';

const Tags = [
    'Game Highlight',
    'Clean Game',
    'All Offensive Possessions',
    'All Defensive Possessions',
    'Offensive Half Build Up',
    'Defensive Half Build Up',
    "Goalkeeper's Build Up",
    'Started From Goalkeeper',
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
            <Divider sx={{ width: '100%', backgroundColor: 'black', opacity: 1, border: 'none', marginTop: '2px' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                {Tags.slice(12, 25).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} />
                ))}
            </Box>
        </>
    );
};

export default GameTagButtonList;
