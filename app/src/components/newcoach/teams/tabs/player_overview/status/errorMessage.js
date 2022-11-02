import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';

import WarningIcon from '../../../../../../assets/warning-icon.png';

const GamePlayerStatErrorMessage = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={WarningIcon} />
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: 'red', flex: 1 }}>You didn't select any Court or Period.</Typography>
            </DialogContent>
            <DialogActions>
                <Button color="warning" onClick={() => onClose()}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GamePlayerStatErrorMessage;
