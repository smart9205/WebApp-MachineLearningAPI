import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import MenuItem from './menuItem';
import { menuData } from './menuData';
import GameService from '../../../services/game.service';

import LogoAlone from '../../../assets/logoAlone.png';
import MenuIcon from '@mui/icons-material/MenuOutlined';

const Sidebar = () => {
    const [minimum, setMinimum] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(undefined);
    const [selectIndex, setSelectIndex] = useState(0);
    const [pathname, setPathname] = useState(window.location.pathname);
    const [gameCount, setGameCount] = useState(0);

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

    useEffect(() => {
        setPathname(window.location.pathname);

        if (pathname.includes('/new_coach/dashboard')) setSelectIndex(0);
        else if (pathname.includes('/new_coach/games')) setSelectIndex(4);
        else if (pathname.includes('/new_coach/reports')) setSelectIndex(7);
        else if (pathname.includes('/new_coach/edits')) setSelectIndex(5);
        else if (pathname.includes('/new_coach/teams')) setSelectIndex(2);
        else if (pathname.includes('/new_coach/opponents')) setSelectIndex(3);
        else if (pathname.includes('/new_coach/leaders')) setSelectIndex(1);
        else if (pathname.includes('/new_coach/players')) setSelectIndex(8);
        else if (pathname.includes('/new_coach/settings')) setSelectIndex(9);
        else if (pathname.includes('/new_coach/video_cutter')) setSelectIndex(6);
        else setSelectIndex(10);

        GameService.getAllGamesByCoach(null, null, null, null).then((res) => {
            setGameCount(res.length);
        });
    }, [pathname]);

    return (
        <Box sx={{ backgroundColor: 'white', width: minimum ? '80px' : '180px', paddingTop: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
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
            {minimum ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', height: '5vh', gap: '4px', marginBottom: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{gameCount}</Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>Games</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '5vh', marginBottom: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{gameCount} Games</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Sidebar;
