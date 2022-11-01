import React from 'react';
import { Box, Divider } from '@mui/material';

import GameTagButton from './tagButton';

const Tags = [
    'Game Highlight',
    'Clean Game',
    'All Offensive Possessions',
    'All Defensive Possessions',
    'Build Up Opponent Half',
    'Build Up Own Half',
    'Build Up Goalkeeper',
    'Started From Goalkeeper',
    'Counter-Attacks',
    'Started From Interception',
    'Started From Tackle',
    'Started From Throw In',
    'Goals',
    'Chances',
    'Free Kicks',
    'Corners',
    'Crosses',
    'Draw Fouls',
    'Turnovers',
    'Offsides',
    'Penalties Gained',
    'Saved',
    'Blocked',
    'Clearance'
];

const GameTagButtonList = ({ selectedTag, onShow, isTeams }) => {
    return (
        <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '0px' }}>
                {Tags.slice(isTeams ? 2 : 0, 12).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} width="236px" />
                ))}
            </Box>
            <Divider sx={{ width: '100%', backgroundColor: 'Green', opacity: 1, border: 'none', marginTop: '3px', marginBottom: '3px'  }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '0px' }}>
                {Tags.slice(12, 24).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} width="132px" />
                ))}
            </Box>
        </>
    );
};

export default GameTagButtonList;
