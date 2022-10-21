import { Typography, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import NotifyIcon from '../../../assets/notify.png';

const MenuItem = ({ path, icon, title, isMinimized, isHover, isSelected, isEnabled }) => {
    console.log(title, ' ', isEnabled);
    return (
        <Link to={path}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '42px', gap: '8px' }}>
                <Box
                    sx={{
                        position: 'relative',
                        height: '100%',
                        padding: '9px 15px 9px 30px',
                        borderRadius: '0 20px 20px 0',
                        backgroundColor: isSelected ? '#C5EAC6' : 'white',
                        'svg path': {
                            fill: isHover || isSelected ? '#0A7304' : '#A5A5A8'
                        },
                        'svg circle': {
                            fill: isHover || isSelected ? '#0A7304' : '#A5A5A8'
                        }
                    }}
                >
                    {icon}
                    {isEnabled && (
                        <div style={{ position: 'absolute', top: 0, right: '10px' }}>
                            <img src={NotifyIcon} style={{ height: '18px' }} />
                        </div>
                    )}
                </Box>
                {!isMinimized && <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', fontWeight: 'DM Sans', color: isSelected ? '#0A7304' : isHover ? '#0A7304' : '#A5A5A8' }}>{title}</Typography>}
            </Box>
        </Link>
    );
};

export default MenuItem;
