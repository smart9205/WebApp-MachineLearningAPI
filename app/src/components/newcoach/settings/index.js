import { Box, Typography } from '@mui/material';
import React from 'react';

import ProfileTab from './profileTab';

const Settings = () => {
    return (
        <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
            <Box sx={{ padding: '24px 24px 48px 48px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Settings</Typography>
            </Box>
            <ProfileTab />
        </Box>
    );
};

export default Settings;
