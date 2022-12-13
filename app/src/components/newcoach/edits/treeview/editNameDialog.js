import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import GameService from '../../../../services/game.service';

const EditNameDialog = ({ open, onClose, node, nodes, updateList, t }) => {
    const [name, setName] = useState('');
    let folders = Array.isArray(nodes) ? [...nodes] : [];

    const renameFolderEdit = (item, id, new_name) => {
        if (item.id === id) item.name = new_name;
        else {
            if (Array.isArray(item.children))
                item.children.map((child) => {
                    return renameFolderEdit(child, id, new_name);
                });
        }

        return item;
    };

    const updateData = () => {
        if (folders) {
            const newlist = folders.map((folder) => {
                return renameFolderEdit(folder, node.edit.id, name);
            });

            updateList(newlist);
        }
    };

    const handleSave = () => {
        GameService.updateUserEdit({ id: node.edit.id, name }).then((res) => {
            onClose();
            updateData();
        });
    };

    useEffect(() => {
        if (node.edit) setName(node.edit.name);
    }, [node]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{node.isFolder ? t('Folder Name') : t('Edit Name')}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                    label=""
                    autoFocus
                    inputProps={{ 'aria-label': 'Without label' }}
                    placeholder={t('Name')}
                    variant="outlined"
                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>{t('Cancel')}</Button>
                <Button variant="outlined" onClick={() => handleSave()}>
                    {t('Update')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditNameDialog;
