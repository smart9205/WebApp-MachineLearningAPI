import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import SortIcon from '@mui/icons-material/SortOutlined';

import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import PlayerEditDialog from './playerEditDialog';

const PlayerListItem = ({ row, isHover }) => {
    const [open, setOpen] = useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                minWidth: '850px',
                fontWeight: 500,
                height: '70px',
                width: '100%',
                boxShadow: isHover ? '0px 4px 16px rgba(0, 0, 0, 0.1)' : 'none'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 15 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <img style={{ height: '48px' }} src={row.image ? row.image : PLAYER_ICON_DEFAULT} alt="Player Logo" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 3, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{row.name}</Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>#{row.jersey_number}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 4, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{row.team_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 7, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{row.pos_name}</Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: 1,
                    'svg path': { fill: '#A5A5A8' },
                    '&:hover': { 'svg path': { fill: '#0A7304' } }
                }}
                onClick={() => setOpen(true)}
            >
                <SortIcon />
            </Box>
            <PlayerEditDialog open={open} onClose={handleCloseDialog} player={row} />
        </Box>
    );
};

export default PlayerListItem;
