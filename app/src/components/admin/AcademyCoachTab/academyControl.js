import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/AddOutlined';

import GameService from '../../../services/game.service';

const AcademyControl1 = ({ select }) => {
    const [academyList, setAcademyList] = useState([]);
    const [academyName, setAcademyName] = useState('');
    const [academyCountry, setAcademyCountry] = useState('');
    const [addOpen, setAddOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const loadAllAcademiesCoach = () => {
        setLoading(true);
        setAcademyList([]);
        setSelectedIndex(-1);
        select(null);
        GameService.getAllAcademies().then((res) => {
            setAcademyList(res);
            setLoading(false);
        });
    };

    const handleAddNewAcademy = () => {
        if (academyName === '' || academyCountry === '') return;

        GameService.addAcademy(academyName, academyCountry).then((res) => {
            setAlertOpen(true);
        });
    };

    const getBackgroundColor = (index) => {
        return selectedIndex === index ? '#3C3C3C' : 'none';
    };

    const handleDeleteAcademy = (item) => {
        GameService.deleteAcademy(item.id).then((res) => {
            loadAllAcademiesCoach();
        });
    };

    useEffect(() => {
        loadAllAcademiesCoach();
    }, []);

    console.log('academy => ', academyList);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <IconButton size="small" sx={{ padding: 0 }} onClick={() => setAddOpen(true)}>
                    <AddIcon />
                </IconButton>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', margin: 0 }}>Academy</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '240px', height: '70vh', padding: '16px 12px' }}>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '65vh', overflowY: 'auto' }}>
                        {academyList.map((item, index) => (
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
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{item.name}</Typography>
                                </div>
                                {selectedIndex === index && (
                                    <IconButton onClick={() => handleDeleteAcademy()}>
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
                <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
                    <DialogTitle style={{ textAlign: 'right' }}>
                        <IconButton onClick={() => setAddOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
                        <TextField
                            value={academyName}
                            label="Academy Name"
                            variant="outlined"
                            autoFocus
                            onChange={(e) => setAcademyName(e.target.value)}
                            sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />
                        <TextField
                            value={academyCountry}
                            label="Academy Country"
                            variant="outlined"
                            onChange={(e) => setAcademyCountry(e.target.value)}
                            sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setAddOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="outlined" onClick={() => handleAddNewAcademy()}>
                            ADD
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AcademyControl1;
