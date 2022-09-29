import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const EditConfirmMessage = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText>You did not select edit.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => onClose()}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditConfirmMessage;
