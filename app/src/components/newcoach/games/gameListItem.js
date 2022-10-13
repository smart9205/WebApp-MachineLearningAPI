import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Divider, Popover, CircularProgress } from '@mui/material';

import SortIcon from '@mui/icons-material/SortOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import ExportIcon from '../../../assets/Export.svg';
import DownloadIcon from '@mui/icons-material/Download';
import GameImage from '../../../assets/game_image.png';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { SaveButton } from '../components/common';
import GameService from '../../../services/game.service';
import GameEditPage from './gameEditPage';
import ExcelDataFiltering from '../../coach/ExcelDataFiltering';
import { XmlDataFilterGames, XmlDataFilterGamesShort } from '../components/xmldata';
import { getFormattedDate } from '../components/utilities';

const GameListItem = ({ row, isHover, isPending = false, updateList, team, standing }) => {
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [exportExcel, setExportExcel] = useState(false);
    const [exportGate, setExportGate] = useState(false);
    const [exportSportShort, setExportSportShort] = useState(false);
    const [playerTagList, setPlayerTagList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState({
        videoURL: '',
        mobileURL: ''
    });

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const saveChanges = () => {
        updateList(
            {
                id: row.id,
                video_url: rowData.videoURL,
                mobile_video_url: rowData.mobileURL
            },
            false
        );
        GameService.updateGame({
            id: row.id,
            image: row.image,
            season_id: row.season_id,
            league_id: row.league_id,
            home_team_id: row.home_team_id,
            home_team_standing_id: row.home_team_standing_id,
            away_team_id: row.away_team_id,
            away_team_standing_id: row.away_team_standing_id,
            date: row.date,
            video_url: rowData.videoURL,
            mobile_video_url: rowData.mobileURL,
            mute_video: row.mute_video
        });
    };

    const handleCloseDialog = () => {
        setEditOpen(false);
    };

    const handleShowPopover = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleClickEdit = () => {
        setEditOpen(true);
        setMenuAnchorEl(null);
    };

    const handleClickSportGate = () => {
        setLoading(true);
        setExportGate(true);
        setMenuAnchorEl(null);
    };

    const handleClickSportCodeShort = () => {
        setLoading(true);
        setExportSportShort(true);
        setMenuAnchorEl(null);
    };

    const handleClickExcel = async () => {
        await getAllInfosByGame(row);
        setExportExcel(true);
        setMenuAnchorEl(null);
    };

    const handleDownloadVideo = (url) => {
        setMenuAnchorEl(null);

        const link = document.createElement('a');

        link.href = url;
        link.target = '_blank';
        link.click();
    };

    const getAllInfosByGame = async (game) => {
        let team_id = null;

        setLoading(true);

        if (team === 'none') team_id = game.home_team_id;
        else team_id = game.home_team_name === team ? game.home_team_id : game.away_team_id;

        if (team_id !== null) {
            await GameService.getAllPlayerTagsByTeam(parseInt(team_id), parseInt(game.id)).then((res) => {
                setPlayerTagList(res);
            });
        }

        setLoading(false);
    };

    const handleChangePath = (gameId) => () => {
        navigate(`/new_coach/games/${btoa(gameId)}`);
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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{getFormattedDate(row.date)}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{row.league_name}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d', flex: 1, textAlign: 'center' }}>{row.season_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '500px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 3 }}>
                            <img src={row.home_team_image ? row.home_team_image : TEAM_ICON_DEFAULT} style={{ width: '24px' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d' }}>{row.home_team_goals}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d' }}>{row.home_team_name}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d', flex: 2 }}>
                            {row.home_team_standing_name === 'Unknown' ? '' : row.home_team_standing_name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '500px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 3 }}>
                            <img src={row.away_team_image ? row.away_team_image : TEAM_ICON_DEFAULT} style={{ width: '24px' }} />
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d' }}>{row.away_team_goals}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d' }}>{row.away_team_name}</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1a1b1d', flex: 2 }}>
                            {row.away_team_standing_name === 'Unknown' ? '' : row.away_team_standing_name}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {!isPending && (
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
            )}
            <Popover
                id={menuPopoverId}
                open={menuPopoverOpen}
                anchorEl={menuAnchorEl}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ '& .MuiPopover-paper': { width: '250px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickEdit}>
                    <EditIcon />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Edit Game</Typography>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickSportGate}>
                    <img src={ExportIcon} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Sportcode</Typography>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickSportCodeShort}>
                    <img src={ExportIcon} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Sportcode Short Version</Typography>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={handleClickExcel}>
                    <img src={ExportIcon} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Export to Excel</Typography>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleDownloadVideo(row.video_url)}>
                    <DownloadIcon />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Download Video</Typography>
                </Box>
            </Popover>
            {isPending && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '550px', gap: '24px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontSize: '12px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Video URL:</Typography>
                            <TextField
                                value={rowData.videoURL}
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                onChange={(e) => setRowData({ ...rowData, videoURL: e.target.value })}
                                sx={{
                                    borderRadius: '10px',
                                    height: '32px',
                                    width: '250px',
                                    '& legend': { display: 'none' },
                                    '& fieldset': { top: 0 },
                                    '& .MuiOutlinedInput-input': { padding: '8px 16px' }
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontSize: '12px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Mobile Video URL:</Typography>
                            <TextField
                                value={rowData.mobileURL}
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                onChange={(e) => setRowData({ ...rowData, mobileURL: e.target.value })}
                                sx={{
                                    borderRadius: '10px',
                                    height: '32px',
                                    width: '250px',
                                    '& legend': { display: 'none' },
                                    '& fieldset': { top: 0 },
                                    '& .MuiOutlinedInput-input': { padding: '8px 16px' }
                                }}
                            />
                        </Box>
                    </Box>
                    <SaveButton disabled={rowData.videoURL.length === 0 && rowData.mobileURL.length === 0} onClick={saveChanges} sx={{ width: '300px', height: '32px', fontSize: '14px' }}>
                        + Update
                    </SaveButton>
                </Box>
            )}
            <GameEditPage open={editOpen} onClose={handleCloseDialog} game={row} updateGameList={updateList} standingList={standing} />
            {exportGate && <XmlDataFilterGames game={row} setXML={setExportGate} setLoading={setLoading} />}
            {exportSportShort && <XmlDataFilterGamesShort game={row} setXML={setExportSportShort} setLoading={setLoading} />}
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
