import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

const GameEditPage = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="2000px" maxheight="initial">
            <DialogContent style={{ display: 'flex', margin: '0 200px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px', paddingBottom: '42px' }}></DialogContent>
        </Dialog>
    );
};

export default GameEditPage;
