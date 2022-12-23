import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';

import GameService from '../../../services/game.service';

const SubscriptionDialog = ({ open, onClose, user, refresh }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleUpdateSubscription = () => {
        GameService.updateSubscription(user.subscription_id, startDate, endDate).then((res) => {
            onClose();
            refresh((r) => !r);
        });
    };

    useEffect(() => {
        setStartDate(user?.subscription_start ?? new Date());
        setEndDate(user?.subscription_end ?? new Date());
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogContent dividers style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue.toDateString());
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue.toDateString());
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" onClick={() => handleUpdateSubscription()}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubscriptionDialog;
