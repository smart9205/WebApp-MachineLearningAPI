import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const EditConfirmMessage = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText>Did you select correctly Edit to save new clip?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(true)}>Yes</Button>
                <Button onClick={() => onClose(false)}>No</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditConfirmMessage;
