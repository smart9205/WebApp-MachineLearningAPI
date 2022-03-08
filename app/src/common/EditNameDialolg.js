import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function EditNameDialog({ open, name, setName, handleEditClose }) {
    return (
        <Dialog open={open} onClose={e => handleEditClose("")}>
            <DialogTitle>Edit</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    variant="outlined"
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleEditClose("")}>Cancel</Button>
                <Button onClick={e => handleEditClose(name)}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
