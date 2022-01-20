import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

export default function DeleteConfirmDialog({ open, handleDeleteClose }) {
    return (
        <Dialog open={open} onClose={e => handleDeleteClose(false)}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You are going to delete, are you sure?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleDeleteClose(false)}>Cancel</Button>
                <Button onClick={e => handleDeleteClose(true)}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}
