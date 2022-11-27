import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize, TextField } from '@mui/material';
import React, { useState } from 'react';

import GameService from '../../../../services/game.service';

const EditShareDialog = ({ open, onClose, edit }) => {
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [comment, setComment] = useState('');

    const handleShare = async () => {
        if (username === '' || userEmail === '' || comment === '') return;

        let shareId = '';

        await GameService.getEditbyId(edit.id).then((res) => {
            shareId = res[0].share_id;
        });
        await GameService.sendShareEmail({ share_id: shareId, edit_name: edit.name, name: username, email: userEmail, text: comment }).then((res) => {
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} scroll="paper" aria-labelledby="scroll-dialog-title">
            <DialogTitle id="scroll-dialog-title">{edit ? edit.name : 'Share for Edit'}</DialogTitle>
            <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '72px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '36px' }}>
                    <TextField
                        value={username}
                        label="Share To"
                        variant="outlined"
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '450px', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        value={userEmail}
                        label="Email"
                        variant="outlined"
                        helperText="Can put several email addresses by seperating using comma and white space. For example, aa@gmail.com, bb@gmail.com"
                        onChange={(e) => setUserEmail(e.target.value)}
                        sx={{ borderRadius: '10px', height: '48px', width: '450px', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </div>
                <TextareaAutosize minRows={6} maxRows={6} value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '450px', borderRadius: '10px' }} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" onClick={() => handleShare()}>
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditShareDialog;
