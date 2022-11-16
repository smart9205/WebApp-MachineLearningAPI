import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

import gameService from '../../../../services/game.service';

const EditCreateClipDialog = ({ open, onClose, editNode, clip, onPlay, updateList }) => {
    const [clipName, setClipName] = useState('');

    const handleCreateClip = async () => {
        if (editNode === null) window.alert('You did not select any Edit to save new clip. Please select Edit.');
        else {
            if (editNode.type === 'folder') window.alert('You selected Folder. Please select correctly Edit to save new clip.');
            else {
                let newClip = { ...clip };

                await gameService.getBiggestSortNumber('Clip', editNode.id).then((res) => {
                    const bigSort = res['biggest_order_num'] === null ? 0 : res['biggest_order_num'];

                    newClip.sort = bigSort + 1;
                    newClip.edit_id = editNode.id;
                    newClip.name = clipName;
                });

                await gameService.addNewEditClips({ id: editNode.id, rows: [newClip] }).then((res) => {
                    onPlay(true);
                    updateList(true);
                });
            }
        }

        onClose();
    };

    useEffect(() => {
        setClipName('');
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} scroll="paper" style={{ zIndex: 99999 }}>
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
