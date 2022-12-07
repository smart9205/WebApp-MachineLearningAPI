import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { MenuProps } from '../../newcoach/components/common';
import GameService from '../../../services/game.service';
import { getComparator, stableSort } from '../../newcoach/components/utilities';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

const AcademyTeamControl = ({ representative, academy, select }) => {
    const [academyTeamList, setAcademyTeamList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [seasonFilter, setSeasonFilter] = useState(null);
    const [teamList, setTeamList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshDialog, setRefreshDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const getSearchedList = () => {
        return teamList.filter((item) => item.name.includes(searchText));
    };

    const getBackgroundColor = (index) => {
        return selectedIndex === index ? '#3C3C3C' : 'none';
    };

    const handleAddTeamToAcademy = (item) => {
        GameService.addTeamToAcademy(representative.user_id, academy.academy_id, seasonFilter.id, item.id).then((res) => {
            setRefreshDialog(!refreshDialog);
        });
    };

    const handleDeleteTeamFromAcademy = (item) => {
        GameService.deleteTeamsFromAcademy(representative.user_id, academy.academy_id, seasonFilter.id, item.id).then((res) => {
            setRefreshDialog(!refreshDialog);
        });
    };

    useEffect(async () => {
        await GameService.getAllSeasons().then((res) => {
            const descArray = stableSort(res, getComparator('desc', 'id'));

            setSeasonList(descArray);
            setSeasonFilter(descArray[0]);
        });
        await GameService.getAllTeams().then((res) => {
            setTeamList(res);
        });
    }, []);

    useEffect(() => {
        if (representative === null || academy === null || seasonFilter === null) return;

        setLoading(true);
        GameService.getTeamsByAcademy(representative.user_id, academy.academy_id, seasonFilter.id).then((res) => {
            setAcademyTeamList(res);
            setLoading(false);
        });
    }, [academy, refreshDialog, seasonFilter]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', textAlign: 'center', margin: 0 }}>Teams</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '300px', height: '70vh', padding: '16px 12px' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Select
                        value={seasonFilter}
                        onChange={(e) => setSeasonFilter(e.target.value)}
                        label=""
                        variant="outlined"
                        IconComponent={ExpandMoreIcon}
                        inputProps={{ 'aria-label': 'Without label' }}
                        MenuProps={MenuProps}
                        sx={{ outline: 'none', height: '36px', width: '120px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                    >
                        {seasonList.map((season, index) => (
                            <MenuItem key={index} value={season}>
                                {season.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="outlined" disabled={teamList.length === 0} onClick={() => setDialogOpen(true)}>
                        ADD
                    </Button>
                </div>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '55vh', overflowY: 'auto' }}>
                        {academyTeamList.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid white',
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    background: getBackgroundColor(index)
                                }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    select(item);
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FolderSharedIcon />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{item.name}</Typography>
                                </div>
                                {selectedIndex === index && (
                                    <IconButton onClick={() => handleDeleteTeamFromAcademy(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle style={{ textAlign: 'right' }}>
                    <IconButton onClick={() => setDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px', height: '65vh' }}>
                    <TextField
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search"
                        label=""
                        inputProps={{ 'aria-label': 'Without label' }}
                        variant="outlined"
                        autoFocus
                        sx={{
                            width: '100%',
                            fontSize: '0.8rem',
                            '& legend': { display: 'none' },
                            '& fieldset': { top: 0 },
                            '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                            '& .MuiOutlinedInput-input': { padding: 0, height: '36px' }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {getSearchedList().map((item, index) => (
                            <div
                                key={index}
                                style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '4px 8px', borderBottom: '1px solid #E8E8E8', cursor: 'pointer' }}
                                onClick={() => handleAddTeamToAcademy(item)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px' }}>
                                    <img src={item.image ? item.image : TEAM_ICON_DEFAULT} style={{ height: '50px' }} />
                                </div>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{item.name}</Typography>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AcademyTeamControl;
