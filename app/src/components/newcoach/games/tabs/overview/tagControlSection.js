import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';

import ExportIcon from '@mui/icons-material/FileDownloadOutlined';

const GameTagControlSection = ({ clipCount, isSelectAll, onAll, onHudl, onRender, onEdits }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{clipCount} Clips</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
                <Checkbox value={isSelectAll} onChange={onAll} />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Select All</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onHudl}>
                <ExportIcon />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Sportcode</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onRender}>
                <ExportIcon />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Render</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', 'svg path': { fill: '#1a1b1d' } }} onClick={onEdits}>
                <ExportIcon />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>My Edits</Typography>
            </Box>
        </Box>
    );
};

export default GameTagControlSection;
