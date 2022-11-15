import React, { useState } from 'react';

import SettingsRenderTool from './rendertool';
import SettingsProfile from './profileTab';
import SettingsPassword from './passwordTab';

import '../coach_style.css';

const Tabs = ['Render Tool', 'Profile', 'Password'];

const Settings = () => {
    const [curTab, setCurTab] = useState(0);

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
        </div>
    );
};

export default Settings;
