import { Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';

import GameService from '../../../services/game.service';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';

const RepresentativeControl = ({ list, refreshList }) => {
    const [userList, setUserList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleDisplayUserList = () => {
        GameService.getAllUsers().then((res) => {
            setUserList(res);
            setDialogOpen(true);
        });
    };

    const handleAddRepresentative = (item) => {
        GameService.addRepresentative(item.id).then((res) => {
            refreshList();
        });
    };

    const handleDeleteRepresentative = (item) => {
        GameService.deleteRepresentative(item.user_role, item.id).then((res) => {
            refreshList();
        });
    };

    const getFullName = (item) => {
        return item ? item.first_name + ' ' + item.last_name : '';
    };

    const getSearchedList = () => {
        return userList.filter((item) => getFullName(item).includes(searchText));
    };

    console.log('search => ', searchText);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '280px', height: '60vh', padding: '16px 12px' }}>
            <div style={{ width: '100%', textAlign: 'right' }}>
                <Button variant="outlined" onClick={() => handleDisplayUserList()}>
                    ADD
                </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '55vh', overflowY: 'auto' }}>
                {list.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid white', borderRadius: '8px', padding: '4px 8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{`${item.first_name} ${item.last_name}`}</Typography>
                        <IconButton onClick={() => handleDeleteRepresentative(item)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
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
    );
};

export default RepresentativeControl;
