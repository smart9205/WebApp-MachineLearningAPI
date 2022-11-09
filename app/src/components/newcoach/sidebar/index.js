import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from './menuItem';
import { menuData } from './menuData';
import GameService from '../../../services/game.service';
import { getCorrectionCount } from '../../../actions/game';
import '../coach_style.css';

import LogoAlone from '../../../assets/logoAlone.png';
import MenuIcon from '@mui/icons-material/MenuOutlined';

const Sidebar = () => {
    const [minimum, setMinimum] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(undefined);
    const [selectIndex, setSelectIndex] = useState(0);
    const [pathname, setPathname] = useState(window.location.pathname);
    const [gameCount, setGameCount] = useState(0);
    const [menuList, setMenuList] = useState([]);
    const [menuState, setMenuState] = useState({
        corrections: false
    });

    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.game);

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

    useEffect(async () => {
        setPathname(window.location.pathname);
        setMenuList(menuData.filter((item) => item.id !== 'dashboard'));

        const paths = menuData.filter((item) => item.id !== 'dashboard').map((item) => item.path);

        if (pathname.includes('/new_coach/dashboard')) setSelectIndex(paths.indexOf('/new_coach/dashboard'));
        else if (pathname.includes('/new_coach/games')) setSelectIndex(paths.indexOf('/new_coach/games'));
        else if (pathname.includes('/new_coach/reports')) setSelectIndex(paths.indexOf('/new_coach/reports'));
        else if (pathname.includes('/new_coach/edits')) setSelectIndex(paths.indexOf('/new_coach/edits'));
        else if (pathname.includes('/new_coach/teams')) setSelectIndex(paths.indexOf('/new_coach/teams'));
        else if (pathname.includes('/new_coach/opponents')) setSelectIndex(paths.indexOf('/new_coach/opponents'));
        else if (pathname.includes('/new_coach/leaders')) setSelectIndex(paths.indexOf('/new_coach/leaders'));
        else if (pathname.includes('/new_coach/players')) setSelectIndex(paths.indexOf('/new_coach/players'));
        else if (pathname.includes('/new_coach/goalkeepers')) setSelectIndex(paths.indexOf('/new_coach/goalkeepers'));
        else if (pathname.includes('/new_coach/settings')) setSelectIndex(paths.indexOf('/new_coach/settings'));
        else if (pathname.includes('/new_coach/video_cutter')) setSelectIndex(paths.indexOf('/new_coach/video_cutter'));
        else setSelectIndex(paths.indexOf('/new_coach/corrections'));

        await GameService.getNumberOfGamesOrdered(null).then((res) => {
            setGameCount(res[0].total_game);
            setMenuList(menuData.filter((item) => item.id !== 'dashboard'));
        });

        dispatch(getCorrectionCount());
    }, [pathname]);

    useEffect(() => {
        setMenuState({ ...menuState, corrections: currentGame.correctionCnt > 0 });
    }, [currentGame]);

    return (
        <Box sx={{ backgroundColor: 'white', width: minimum ? '80px' : '180px', paddingTop: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: minimum ? 'none' : 'space-between', 'svg path': { fill: 'black' }, padding: '0 24px 0 30px', height: '40px' }}>
                    <MenuIcon sx={{ cursor: 'pointer' }} onClick={() => handleMenuControl()} />
                    {!minimum && (
                        <Link to="/" style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={LogoAlone} style={{ height: '40px' }} />
                        </Link>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {menuList.map((menuItem, idx) => (
                        <Box key={idx} onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave} onClick={() => setSelectIndex(idx)}>
                            <MenuItem
                                path={menuItem.path}
                                icon={menuItem.icon}
                                title={menuItem.title}
                                isMinimized={minimum}
                                isHover={idx === hoverIndex ? true : false}
                                isSelected={idx === selectIndex ? true : false}
                                isEnabled={menuState[menuItem.id]}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
            {minimum ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', gap: '4px', marginBottom: '8px' }}>
                    <p className="sidebar-game-count">{gameCount}</p>
                    <p className="sidebar-game-count">Games</p>
                    <p className="sidebar-game-count">Ordered</p>
                </div>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '5vh', marginBottom: '8px' }}>
                    <p className="sidebar-game-count">{gameCount} Games Ordered</p>
                </Box>
            )}
        </Box>
    );
};

export default Sidebar;
