import React from 'react';
import { Box, Typography } from '@mui/material';

import ForwardIcon from '@mui/icons-material/ForwardTwoTone';

const GameOverviewHeader = ({ isOur, ourname, enemyname, onChangeTeam, mb }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: mb }}>
            <p className="normal-text">{ourname}</p>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{ 'svg path:last-of-type': { fill: 'black' }, 'svg path:first-of-type': { fill: isOur ? 'green' : 'white', opacity: 1 }, cursor: 'pointer' }}
                    onClick={() => onChangeTeam(true)}
                >
                    <ForwardIcon sx={{ transform: 'rotate(180deg)' }} fontSize="large" />
                </Box>
                <Box
                    sx={{ 'svg path:last-of-type': { fill: 'black' }, 'svg path:first-of-type': { fill: isOur ? 'white' : 'green', opacity: 1 }, cursor: 'pointer' }}
                    onClick={() => onChangeTeam(false)}
                >
                    <ForwardIcon fontSize="large" />
                </Box>
            </Box>
            <p className="normal-text">{enemyname}</p>
        </Box>
    );
};

export default GameOverviewHeader;
