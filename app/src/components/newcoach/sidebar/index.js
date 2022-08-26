import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import MenuItem from './menuItem';
import { menuData } from './menuData';

import Logo from '../../../assets/LogoforLightBackground.png';
import LogoAlone from '../../../assets/logoAlone.png';
import MenuIcon from '@mui/icons-material/MenuOutlined';

const Sidebar = () => {
    const theme = useTheme();
    const [minimum, setMinimum] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(undefined);
    const [selectIndex, setSelectIndex] = useState(undefined);

    const handleMenuControl = () => {
        if (minimum) setMinimum(false);
        else setMinimum(true);
    };

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(undefined);
    };

    return (
        <Box sx={{ backgroundColor: 'white', height: '100%', width: '180px', minWidth: '180px', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: minimum ? 'none' : 'space-between', 'svg path': { fill: 'black' }, padding: '0 24px 0 30px', height: '40px' }}>
                <MenuIcon sx={{ cursor: 'pointer' }} onClick={() => handleMenuControl()} />
                {!minimum && (
                    <Link to="/" style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={LogoAlone} style={{ height: '40px' }} />
                    </Link>
                )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {menuData.map((menuItem, idx) => (
                    <Box key={idx} onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave} onClick={() => setSelectIndex(idx)}>
                        <MenuItem
                            path={menuItem.path}
                            icon={menuItem.icon}
                            title={menuItem.title}
                            isMinimized={minimum}
                            isHover={idx === hoverIndex ? true : false}
                            isSelected={idx === selectIndex ? true : false}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Sidebar;
