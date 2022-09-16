import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import GameService from '../../../services/game.service';

const EditNameDialog = ({ open, onClose, node, updateList }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        GameService.updateUserEdit({ id: node.edit.id, name }).then((res) => {
            onClose();
            updateList((old) => !old);
        });
    };

    useEffect(() => {
        if (node.edit) setName(node.edit.name);
    }, [node]);

    console.log(name);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{node.isFolder ? 'Folder Name' : 'Edit Name'}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label=""
                    autoFocus
                    inputProps={{ 'aria-label': 'Without label' }}
                    placeholder="New Folder or Edit Name"
                    variant="outlined"
                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleSave()}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditNameDialog;
