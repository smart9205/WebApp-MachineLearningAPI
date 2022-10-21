import { Box } from '@mui/material';
import React, { useState } from 'react';

import ProfileTab from './profileTab';
import PasswordTab from './passwordTab';
import '../coach_style.css';

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
            <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <p className="page-title">Settings</p>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    {Tabs.map((tab, index) => (
                        <Box onClick={() => handleTabClick(index)} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px', width: 'fit-content', cursor: 'pointer' }}>
                            <p className="page-tab">{tab}</p>
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
