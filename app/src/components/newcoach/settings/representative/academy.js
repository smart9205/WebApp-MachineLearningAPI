import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import FolderSharedIcon from '@mui/icons-material/FolderShared';

import GameService from '../../../../services/game.service';

const SettingsAcademyControl = ({ userId, select, t }) => {
    const [academyList, setAcademyList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        GameService.getAcademiesForRepresentative(userId).then((res) => {
            setAcademyList(res);
            setLoading(false);
        });
    }, [userId]);

    return (
        <div className="settings_academy_container">
            <p className="normal-text">{t('Academy')}</p>
            <div className="academy_section">
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="academy_items_container">
                        {academyList.map((item, index) => (
                            <div
                                key={index}
                                className="academy_item"
                                style={{ background: selectedIndex === index ? '#C5EAC6' : 'white' }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    select(item);
                                }}
                            >
                                <FolderSharedIcon />
                                <p className="normal-text">{item.academy_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsAcademyControl;
