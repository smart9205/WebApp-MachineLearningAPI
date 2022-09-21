import React from 'react';
import { Box, Popover, Typography, Divider } from '@mui/material';

import ExportIcon from '../../../../../assets/Export.svg';
import VideoIcon from '@mui/icons-material/SlideshowOutlined';

const GameTagMenu = ({ anchor, onClose, onView, onHudl, onRender, onEdits }) => {
    const menuPopoverOpen = Boolean(anchor);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    return (
        <Popover
            id={menuPopoverId}
            open={menuPopoverOpen}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ '& .MuiPopover-paper': { width: '220px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={onView}>
                <VideoIcon />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>View Clips</Typography>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={onHudl}>
                <img src={ExportIcon} />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Sportcode</Typography>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={onRender}>
                <img src={ExportIcon} />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Render</Typography>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={onEdits}>
                <img src={ExportIcon} />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to "My Edits"</Typography>
            </Box>
        </Popover>
    );
};

export default GameTagMenu;
