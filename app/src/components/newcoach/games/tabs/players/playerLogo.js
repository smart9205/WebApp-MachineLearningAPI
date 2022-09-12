import React from 'react';
import { Box, Typography } from '@mui/material';

import { USER_IMAGE_DEFAULT } from '../../../../../common/staticData';

const GamePlayerLogo = ({ player }) => {
    const getImage = () => {
        return player.image && player.image.length > 0 ? player.image : USER_IMAGE_DEFAULT;
    };

    return (
        <Box sx={{ width: '80px', height: '100px', borderRadius: '8px', background: `url(${getImage()}) center center / cover no-repeat silver`, position: 'relative' }}>
            <Box
                sx={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: 'silver',
                    borderRadius: '0 0 8px 8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    bottom: 0,
                    position: 'absolute'
                }}
            >
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 500, color: '#1a1b1d' }}>{player.first_name}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 500, color: '#1a1b1d' }}>{player.last_name}</Typography>
            </Box>
        </Box>
    );
};

export default GamePlayerLogo;
