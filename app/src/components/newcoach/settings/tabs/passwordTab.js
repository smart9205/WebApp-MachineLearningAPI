import React from 'react';
import { FormControl, Typography, Box } from '@mui/material';

import { BootstrapInput, SaveButton } from '../components';

const PasswordTab = () => {
    return (
        <Box sx={{ padding: '24px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', height: '700px' }}>
            <FormControl variant="standard" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: 'DM Sans', fontWeight: 600 }}>Old Password</Typography>
                <BootstrapInput placeholder="Enter password here" />
            </FormControl>
            <FormControl variant="standard" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: 'DM Sans', fontWeight: 600 }}>New Password</Typography>
                <BootstrapInput placeholder="New password" />
            </FormControl>
            <FormControl variant="standard" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: 'DM Sans', fontWeight: 600 }}>Confirm Password</Typography>
                <BootstrapInput placeholder="Confirm" />
            </FormControl>
            <SaveButton disabled sx={{ width: '300px' }}>
                Update Password
            </SaveButton>
        </Box>
    );
};

export default PasswordTab;
