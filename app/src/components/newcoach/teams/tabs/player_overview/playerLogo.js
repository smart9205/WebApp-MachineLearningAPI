import React from 'react';
import { Box, Typography } from '@mui/material';

import EditIcon from '../../../../../assets/editicon.png';

import { USER_IMAGE_DEFAULT } from '../../../../../common/staticData';

const TeamPlayerLogo = ({ player, onShow }) => {
    const getImage = () => {
        return player.image && player.image.length > 0 ? player.image : USER_IMAGE_DEFAULT;
    };

    const getDisplayName = () => {
        if (player.first_name === null && player.last_name !== null) return player.last_name;
        else if (player.first_name !== null && player.last_name === null) return player.first_name;
        else if (player.first_name === null && player.last_name === null) return 'No Name';

        let first = player.first_name.length > 0 ? player.first_name.slice(0, 1) : '';
        let last = player.last_name.length > 0 ? player.last_name.slice(0, 1) : '';

        first = first === ' ' ? player.first_name.slice(1, 2) : first;
        last = last === ' ' ? player.last_name.slice(1, 2) : last;

        return player.last_name.length >= 13 ? `${first}. ${last}.` : `${first}. ${player.last_name}`;
    };

    return (
        <Box sx={{ width: '80px', height: '100px', borderRadius: '8px', background: `url(${getImage()}) center center / cover no-repeat silver`, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ borderRadius: '8px 0', width: '18px', height: '18px', background: '#C5EAC6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player.jersey_number}</Typography>
                </Box>
                <Box
                    sx={{ cursor: 'pointer', background: '#C5EAC6', borderRadius: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px' }}
                    onClick={() => onShow(player)}
                >
                    <img src={EditIcon} style={{ height: '14px', position: 'absolute' }} />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: 'silver',
                    borderRadius: '0 0 8px 8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 0,
                    position: 'absolute'
                }}
            >
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 500, color: '#1a1b1d' }}>{getDisplayName()}</Typography>
            </Box>
        </Box>
    );
};

export default TeamPlayerLogo;
