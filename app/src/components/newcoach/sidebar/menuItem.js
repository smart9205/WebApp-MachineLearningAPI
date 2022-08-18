import { Typography, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ path, icon, title, isMinimized, isHover, isSelected }) => {
    return (
        <Link to={path}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '42px', gap: '8px', margin: '8px 0' }}>
                <Box
                    sx={{
                        height: '100%',
                        padding: '9px 15px 9px 30px',
                        borderRadius: '0 20px 20px 0',
                        backgroundColor: isSelected ? '#FFDFCC' : 'white',
                        'svg path': {
                            fill: isHover || isSelected ? '#FE5E00' : '#A5A5A8'
                        },
                        'svg circle': {
                            fill: isHover || isSelected ? '#FE5E00' : '#A5A5A8'
                        }
                    }}
                >
                    {icon}
                </Box>
                {!isMinimized && <Typography sx={{ fontWeight: 600, fontSize: '14px', fontWeight: 'DM Sans', color: isSelected ? '#444547' : isHover ? '#FE5E00' : '#A5A5A8' }}>{title}</Typography>}
            </Box>
        </Link>
    );
};

export default MenuItem;