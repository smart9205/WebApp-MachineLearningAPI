import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import { MenuProps } from '../../newcoach/components/common';

const subscriptionList = [
    { id: 1, name: 'Tagger' },
    { id: 2, name: 'Coach' },
    { id: 3, name: 'Player' }
];

const SubscriptionDialog = ({ open, onClose, user, refresh }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [subscription, setSubscription] = useState(subscriptionList[0]);

    const handleUpdateSubscription = () => {
        GameService.updateSubscription(user.subscription_id, subscription.id, startDate, endDate).then((res) => {
            onClose();
            refresh((r) => !r);
        });
    };

    useEffect(() => {
        if (user) {
            setStartDate(user?.subscription_start);
            setEndDate(user?.subscription_end);
            setSubscription(subscriptionList.filter((item) => item.name.toLowerCase() === user.subscription_name)[0]);
        }
    }, [open]);

    useEffect(() => {}, []);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogContent dividers style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <FormControl fullWidth>
                    <InputLabel id="select-subscription-label">Subscriptions</InputLabel>
                    <Select
                        labelId="select-subscription-label"
                        id="select-subscription"
                        value={subscription}
                        onChange={(e) => setSubscription(e.target.value)}
                        label="Subscriptions"
                        IconComponent={ExpandMoreIcon}
                        MenuProps={MenuProps}
                    >
                        {subscriptionList.map((sub) => (
                            <MenuItem key={sub.id} value={sub}>
                                {sub.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
