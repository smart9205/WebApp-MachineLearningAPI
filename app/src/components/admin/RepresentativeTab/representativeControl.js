import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';

import GameService from '../../../services/game.service';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';

const RepresentativeControl = ({ select }) => {
    const [representList, setRepresentList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    const loadAllRepresentatives = () => {
        setLoading(true);
        GameService.getAllRepresentatives().then((res) => {
            setRepresentList(res);
            setLoading(false);
        });
    };

    const handleDisplayUserList = () => {
        GameService.getAllUsers().then((res) => {
            setUserList(res);
            setDialogOpen(true);
        });
    };

    const handleAddRepresentative = (item) => {
        GameService.addRepresentative(item.id).then((res) => {
            loadAllRepresentatives();
        });
    };

    const handleDeleteRepresentative = (item) => {
        GameService.deleteRepresentative(7, item.user_id).then((res) => {
            loadAllRepresentatives();
        });
    };

    const getFullName = (item) => {
        return item ? item.first_name + ' ' + item.last_name : '';
    };

    const getSearchedList = () => {
        return userList.filter((item) => getFullName(item).includes(searchText));
    };

    const getBackgroundColor = (index) => {
        return selectedIndex === index ? '#3C3C3C' : 'none';
    };

    useEffect(() => {
        loadAllRepresentatives();
    }, []);

    console.log('search => ', representList);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', textAlign: 'center', margin: 0 }}>Representative</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '240px', height: '70vh', padding: '16px 12px' }}>
                <div style={{ width: '100%', textAlign: 'right' }}>
                    <Button variant="outlined" onClick={() => handleDisplayUserList()}>
                        ADD
                    </Button>
                </div>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '56vh', overflowY: 'auto' }}>
                        {representList.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: getBackgroundColor(index),
                                    border: '1px solid white',
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    select(item);
                                }}
                            >
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{`${item.first_name} ${item.last_name}`}</Typography>
                                <IconButton onClick={() => handleDeleteRepresentative(item)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                )}
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
                                    onClick={() => handleAddRepresentative(item)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px' }}>
                                        <img src={item.user_image ? item.user_image : USER_IMAGE_DEFAULT} style={{ height: '50px' }} />
                                    </div>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{`${item.first_name} ${item.last_name}`}</Typography>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default RepresentativeControl;
