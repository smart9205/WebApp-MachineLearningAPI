import React from 'react';
import { Box } from '@mui/material';

import '../coach_style.css';

const Reports = () => {
    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <p className="page-title">Reports</p>
            </Box>
        </Box>
    );
};

export default Reports;
