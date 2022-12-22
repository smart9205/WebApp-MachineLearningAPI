import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updatepassword } from '../../../actions/auth';

const PasswordDialog = ({ open, onClose, user }) => {
    const dispatch = useDispatch();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = () => {
        dispatch(updatepassword(user.id, newPassword, confirmPassword));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>New Password</DialogTitle>
            <DialogContent dividers style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <TextField
                    type="password"
                    value={newPassword}
                    label="New Password"
                    variant="outlined"
                    autoFocus
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                <TextField
                    type="password"
                    value={confirmPassword}
                    label="Confirm Password"
                    variant="outlined"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ borderRadius: '10px', height: '48px', width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" disabled={newPassword === '' || confirmPassword === ''} onClick={() => handleUpdatePassword()}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordDialog;
