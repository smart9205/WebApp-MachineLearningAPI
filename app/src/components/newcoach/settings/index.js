import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import PasswordTab from './tabs/passwordTab';
import ProfileTab from './tabs/profileTab';

const Tabs = ['Profiles', 'Password'];

const Settings = () => {
    const [curTab, setCurTab] = useState(0);

    return (
        <Box sx={{ minWidth: '95%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 21px 48px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Settings</Typography>
                <Box sx={{ display: 'flex', marginTop: '24px', alignItems: 'center', gap: '24px' }}>
                    {Tabs.map((title, index) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'fit-content', gap: '4px', cursor: 'pointer' }} onClick={() => setCurTab(index)}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: curTab === index ? 'black' : '#A5A5A8' }}>{title}</Typography>
                            <Box sx={{ height: '2px', width: '100%', backgroundColor: curTab === index ? 'red' : '#F8F8F8' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {curTab === 0 && <ProfileTab />}
            {curTab === 1 && <PasswordTab />}
        </Box>
    );
};

export default Settings;
