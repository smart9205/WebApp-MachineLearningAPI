import React from 'react';
import { Box, Divider } from '@mui/material';

import GameTagButton from '../../../games/tabs/overview/tagButton';

const Tags = [
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

const TeamTagButtonList = ({ selectedTag, onShow }) => {
    return (
        <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                {Tags.slice(0, 10).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} />
                ))}
            </Box>
            <Divider sx={{ width: '100%', backgroundColor: 'black', opacity: 1, border: 'none', marginTop: '2px' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px' }}>
                {Tags.slice(10, 23).map((tag, index) => (
                    <GameTagButton key={index} isSelected={selectedTag === tag} tagname={tag} onShow={onShow} />
                ))}
            </Box>
        </>
    );
};

export default TeamTagButtonList;
