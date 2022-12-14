import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Popover, CircularProgress } from '@mui/material';

import SortIcon from '@mui/icons-material/SortOutlined';
import ExportIcon from '../../../assets/Export.svg';
import DownloadIcon from '@mui/icons-material/Download';
import GameImage from '../../../assets/game_image.png';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import GameService from '../../../services/game.service';
import ExcelDataFiltering from '../../coach/ExcelDataFiltering';
import { XmlDataFilterOpponents } from '../components/xmldata';
import { getFormattedDate } from '../components/utilities';
import '../coach_style.css';

const GameListItem = ({ row, isHover, t }) => {
    const navigate = useNavigate();
    const [exportExcel, setExportExcel] = useState(false);
    const [exportGate, setExportGate] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teamId, setTeamId] = useState(0);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const handleShowPopover = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleClickHomeSportGate = () => {
        setMenuAnchorEl(null);
        setTeamId(row.home_team_id);
        setLoading(true);
        setExportGate(true);
    };

    const handleClickAwaySportGate = () => {
        setMenuAnchorEl(null);
        setTeamId(row.away_team_id);
        setLoading(true);
        setExportGate(true);
    };

    const handleClickHomeExcel = async () => {
        setMenuAnchorEl(null);
        setLoading(true);
        await GameService.getAllPlayerTagsByTeam(parseInt(row.home_team_id), parseInt(row.id)).then((res) => {
            setPlayerTagList(res);
            setLoading(false);
        });
        setExportExcel(true);
    };

    const handleClickAwayExcel = async () => {
        setMenuAnchorEl(null);
        setLoading(true);
        await GameService.getAllPlayerTagsByTeam(parseInt(row.away_team_id), parseInt(row.id)).then((res) => {
            setPlayerTagList(res);
            setLoading(false);
        });
        setExportExcel(true);
    };

    const handleDownloadVideo = (url) => {
        setMenuAnchorEl(null);

        const link = document.createElement('a');

        link.href = url;
        link.target = '_blank';
        link.click();
    };

    const handleChangePath = (gameId) => () => {
        navigate(`/new_coach/opponents/${btoa(gameId)}`);
    };

    return (
        <Box
            sx={{
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '10px',
                transition: 'box-shadow 0.3s ease',
                minWidth: '850px',
                fontWeight: 500,
                maxHeight: '200px',
                width: '100%',
                boxShadow: isHover ? '0px 4px 16px rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 15 }} onClick={handleChangePath(row.id)}>
                <img style={{ height: '100px', width: '160px', borderRadius: '12px' }} src={row.image ? row.image : GameImage} alt="Game Logo" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 8, padding: '0 32px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '500px' }}>
                        <p className="normal-text" style={{ flex: 1 }}>
                            {getFormattedDate(row.date)}
                        </p>
                        <p className="normal-text" style={{ flex: 1 }}>
                            {row.league_name}
                        </p>
                        <p className="normal-text" style={{ flex: 1, textAlign: 'center' }}>
                            {row.season_name}
                        </p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={row.home_team_image ? row.home_team_image : TEAM_ICON_DEFAULT} style={{ width: '24px' }} />
                        <p className="normal-text">{row.home_team_goals}</p>
                        <p className="normal-text">{row.home_team_name}</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={row.away_team_image ? row.away_team_image : TEAM_ICON_DEFAULT} style={{ width: '24px' }} />
                        <p className="normal-text">{row.away_team_goals}</p>
                        <p className="normal-text">{row.away_team_name}</p>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    width: '48px',
                    'svg path': { fill: '#A5A5A8' },
                    '&:hover': { 'svg path': { fill: '#0A7304' } }
                }}
                onClick={handleShowPopover}
            >
                <SortIcon />
            </Box>
            <Popover
                id={menuPopoverId}
                open={menuPopoverOpen}
                anchorEl={menuAnchorEl}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ '& .MuiPopover-paper': { width: '360px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickHomeSportGate}>
                    <img src={ExportIcon} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p className="menu-item">{row.home_team_name}</p>
                        <p className="menu-item">{t('Export to Sportcode')}</p>
                    </Box>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickAwaySportGate}>
                    <img src={ExportIcon} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p className="menu-item">{row.away_team_name}</p>
                        <p className="menu-item">{t('Export to Sportcode')}</p>
                    </Box>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickHomeExcel}>
                    <img src={ExportIcon} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p className="menu-item">{row.home_team_name}</p>
                        <p className="menu-item">{t('Export to Excel')}</p>
                    </Box>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickAwayExcel}>
                    <img src={ExportIcon} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p className="menu-item">{row.away_team_name}</p>
                        <p className="menu-item">{t('Export to Excel')}</p>
                    </Box>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleDownloadVideo(row.video_url)}>
                    <DownloadIcon />
                    <p className="menu-item">{t('Download Video')}</p>
                </Box>
            </Popover>
            {exportGate && <XmlDataFilterOpponents game={row} teamId={teamId} setXML={setExportGate} setLoading={setLoading} />}
            {exportExcel && <ExcelDataFiltering team={playerTagList} setExcelData={setExportExcel} />}
            {loading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                >
                    <CircularProgress />
                </div>
            )}
        </Box>
    );
};

export default GameListItem;
