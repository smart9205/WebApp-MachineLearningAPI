import React from 'react';
import { Box, Checkbox } from '@mui/material';

import ExportIcon from '../../../../../assets/Export.svg';

const GameTagControlSection = ({ clipCount, isSelectAll, onAll, onHudl, onRender, onEdits, t }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
            <p className="menu-item">
                {clipCount} {t('Clips')}
            </p>
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
                <Checkbox value={isSelectAll} onChange={onAll} />
                <p className="menu-item">{t('Select All')}</p>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onHudl}>
                <img src={ExportIcon} />
                <p className="menu-item">{t('Sportcode')}</p>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onRender}>
                <img src={ExportIcon} />
                <p className="menu-item">{t('Render')}</p>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onEdits}>
                <img src={ExportIcon} />
                <p className="menu-item">{t('My Edits')}</p>
            </Box>
        </Box>
    );
};

export default GameTagControlSection;
