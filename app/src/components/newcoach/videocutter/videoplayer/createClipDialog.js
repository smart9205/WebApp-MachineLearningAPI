import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

const EditCreateClipDialog = ({ open, onClose, onCreate, editNode }) => {
    const [clipName, setClipName] = useState('');

    const handleCreateClip = () => {
        if (editNode === null) window.alert('You did not select any Edit to save new clip. Please select Edit.');
        else {
            if (editNode.type === 'folder') {
                window.alert('You selected Folder. Please select correctly Edit to save new clip.');
                onClose();
            } else {
                onClose();
                onCreate(clipName);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} scroll="paper">
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>Create New Clip</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={clipName}
                    onChange={(e) => setClipName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateClip();
                        }
                    }}
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
                <Button variant="outlined" onClick={() => handleCreateClip()}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCreateClipDialog;
