import React from 'react';
import { Box } from '@mui/material';

import MenuIcon from '@mui/icons-material/MenuOutlined';

import '../../../coach_style.css';

const GameTagButton = ({ isSelected, tagname, onShow, width }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: width }}>
            <Box sx={{ cursor: 'pointer', 'svg path': { fill: isSelected ? '#0A7304' : '#C5EAC6' }, '&:hover': { 'svg path': { fill: '#0A7304' } } }} onClick={onShow(tagname)}>
                <MenuIcon />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', width: 'fit-content' }}>
                <p className="normal-text">{tagname}</p>
                <Box sx={{ width: '100%', height: '2px', background: isSelected ? '#0A7304' : 'white' }} />
            </Box>
        </Box>
    );
};

export default GameTagButton;
