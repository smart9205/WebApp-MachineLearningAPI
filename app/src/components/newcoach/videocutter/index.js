import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import EditFolderTreeView from '../edits/treeview';
import VCVideoPlayer from './videoplayer';

const VideoCutter = () => {
    const [curEdit, setCurEdit] = useState(null);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Video Cutter</Typography>
            </Box>
            <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', padding: '12px 0' }}>
                    <EditFolderTreeView setEdit={setCurEdit} isMain={true} entireHeight="95%" treeHeight="90%" />
                </div>
                <VCVideoPlayer saveEdit={curEdit} drawOpen={false} />
            </Box>
        </Box>
    );
};

export default VideoCutter;
