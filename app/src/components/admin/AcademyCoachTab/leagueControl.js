import { Alert, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/SearchOutlined';

import GameService from '../../../services/game.service';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

const AcademyLeagueControl = ({ academy, select }) => {
    const [academyLeagueList, setAcademyLeagueList] = useState([]);
    const [leagueList, setLeagueList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    const handleOpenAcademiesDialog = () => {
        GameService.getAllLeagues().then((res) => {
            setLeagueList(res);
            setDialogOpen(true);
        });
    };

    const getSearchedList = () => {
        return leagueList.filter((item) => item.name.includes(searchText));
    };

    const getBackgroundColor = (index) => {
        return selectedIndex === index ? '#3C3C3C' : 'none';
    };

    const handleDeleteAcademyLeague = (item) => {
        select(null);
        setSelectedIndex(-1);
        setAcademyLeagueList(academyLeagueList.filter((data) => data.league_name !== item.league_name));
    };

    const handleAddAcademyLeague = (item) => {
        const filtered = academyLeagueList.filter((data) => data.league_id === item.id);

        if (filtered.length === 0) setAcademyLeagueList((list) => [...list, { league_id: item.id, league_name: item.name, image: item.image }]);
    };

    const loadAllAcademyLeagues = () => {
        select(null);
        setSelectedIndex(-1);
        setAcademyLeagueList([]);

        if (academy === null) return;

        setLoading(true);
        GameService.getAllLeaguesByCoach(academy.user_id).then((res) => {
            setAcademyLeagueList(res);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadAllAcademyLeagues();
    }, [academy]);

    console.log('academy coach =>', academyLeagueList, leagueList);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', textAlign: 'center', margin: 0 }}>Leagues</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '280px', height: '70vh', padding: '16px 12px' }}>
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <Button variant="outlined" disabled={academy === null} onClick={() => handleOpenAcademiesDialog()}>
                        ADD
                    </Button>
                </div>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '55vh', overflowY: 'auto' }}>
                        {academyLeagueList.map((item, index) => (
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
                            >
                                <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        select(item);
                                    }}
                                >
                                    <FolderSharedIcon />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{item.league_name}</Typography>
                                </div>
                                {selectedIndex === index && (
                                    <IconButton onClick={() => handleDeleteAcademyLeague(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                    <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ width: '100%' }}>
                        Successfully added
                    </Alert>
                </Snackbar>
            </div>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle style={{ textAlign: 'right' }}>
                    <IconButton onClick={() => setDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '20px', height: '65vh' }}>
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
                                style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', borderBottom: '1px solid #E8E8E8', cursor: 'pointer' }}
                                onClick={() => handleAddAcademyLeague(item)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px' }}>
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

export default AcademyLeagueControl;
