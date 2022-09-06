import React from 'react';
import { Box, Typography } from '@mui/material';

import ForwardIcon from '@mui/icons-material/ForwardTwoTone';

const GameOverviewHeader = ({ isOur, our, opponent, game, onChangeTeam }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>
                {our === game.home_team_id ? game.home_team_name : game.away_team_name}
            </Typography>
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
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>
                {opponent === game.home_team_id ? game.home_team_name : game.away_team_name}
            </Typography>
        </Box>
    );
};

export default GameOverviewHeader;
