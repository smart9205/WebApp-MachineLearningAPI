import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import ProfileTab from './profileTab';
import PasswordTab from './passwordTab';

const Tabs = ['Profile', 'Password'];

const Settings = () => {
    const [values, setValues] = useState({
        curTab: 0
    });

    const handleTabClick = (idx) => {
        setValues({ ...values, curTab: idx });
    };

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Settings</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    {Tabs.map((tab, index) => (
                        <Box onClick={() => handleTabClick(index)} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px', width: 'fit-content', cursor: 'pointer' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d' }}>{tab}</Typography>
                            <Box sx={{ width: '100%', height: '2px', backgroundColor: values.curTab === index ? '#0A7304' : '#F8F8F8' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {values.curTab === 0 && <ProfileTab />}
            {values.curTab === 1 && <PasswordTab />}
        </Box>
    );
};

export default Settings;
