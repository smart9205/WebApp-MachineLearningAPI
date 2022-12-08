import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SettingsRenderTool from './rendertool';
import SettingsProfile from './profileTab';
import SettingsPassword from './passwordTab';

import '../coach_style.css';
import SettingsRepresentative from './representative';

let Tabs = ['Render Tool', 'Profile', 'Password'];

const Settings = () => {
    const [curTab, setCurTab] = useState(0);
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser.roles.includes('ROLE_REPRESENTATIVE')) Tabs = [...Tabs, 'Representative'];
        if (currentUser.roles.includes('ROLE_MANAGER')) Tabs = [...Tabs, 'Manager'];
    }, [currentUser]);

    console.log(currentUser.roles);

    return (
        <div className="coach-page-style">
            <div className="page-header">
                <p className="page-title">Settings</p>
                <div className="page-tab-container settings-page">
                    {Tabs.map((tab, index) => (
                        <div key={index} onClick={() => setCurTab(index)} className="page-tab-style">
                            <p className="page-tab-title">{tab}</p>
                            {curTab === index ? <div className="selected-line" /> : <div className="unselected-line" />}
                        </div>
                    ))}
                </div>
            </div>
            {curTab === 0 && <SettingsRenderTool />}
            {curTab === 1 && <SettingsProfile />}
            {curTab === 2 && <SettingsPassword />}
            {curTab === 3 && <SettingsRepresentative user_id={currentUser.id} />}
        </div>
    );
};

export default Settings;
