import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SettingsRenderTool from './rendertool';
import SettingsProfile from './profileTab';
import SettingsPassword from './passwordTab';
import SettingsRepresentative from './representative';
import SettingsManager from './manager';

let Tabs = ['Render Tool', 'Profile', 'Password'];

const Settings = ({ t }) => {
    const [curTab, setCurTab] = useState(0);
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!Tabs.includes('Representative')) {
            if (currentUser.roles.includes('ROLE_REPRESENTATIVE')) Tabs = [...Tabs, 'Representative'];
        }
        if (!Tabs.includes('Manager')) {
            if (currentUser.roles.includes('ROLE_MANAGER')) Tabs = [...Tabs, 'Manager'];
        }
    }, [currentUser]);

    console.log(currentUser.roles);

    return (
        <div className="coach-page-style">
            <div className="page-header">
                <p className="page-title">{t('Settings')}</p>
                <div className="page-tab-container settings-page">
                    {Tabs.map((tab, index) => (
                        <div key={index} onClick={() => setCurTab(index)} className="page-tab-style">
                            <p className="page-tab-title">{t(tab)}</p>
                            {curTab === index ? <div className="selected-line" /> : <div className="unselected-line" />}
                        </div>
                    ))}
                </div>
            </div>
            {curTab === 0 && <SettingsRenderTool t={t} />}
            {curTab === 1 && <SettingsProfile t={t} />}
            {curTab === 2 && <SettingsPassword t={t} />}
            {curTab === 3 && <SettingsRepresentative t={t} user_id={currentUser.id} />}
            {curTab === 4 && <SettingsManager t={t} />}
        </div>
    );
};

export default Settings;
