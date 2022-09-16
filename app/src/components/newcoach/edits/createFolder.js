import React, { useState } from 'react';
import { Popover, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, Divider, TextField } from '@mui/material';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import GameService from '../../../services/game.service';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

const EditCreateUserFolder = ({ anchor, onClose, updateList }) => {
    const menuPopoverOpen = Boolean(anchor);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const [folderDialog, setFolderDialog] = useState(false);
    const [folderName, setFolderName] = useState('');

    const handleOpenFolderDialog = async () => {
        onClose();
        setFolderDialog(true);
    };

    const handleCreateFolder = () => {
        GameService.createUserFolder({ name: folderName, parent_id: null }).then((res) => {
            setFolderDialog(false);
            updateList((old) => !old);
        });
    };

    return (
        <>
            <Popover
                id={menuPopoverId}
                open={menuPopoverOpen}
                anchorEl={anchor}
                onClose={onClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ '& .MuiPopover-paper': { width: '220px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleOpenFolderDialog()}>
                    <CreateNewFolderIcon />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Create New Folder</Typography>
                </Box>
            </Popover>
            <Dialog open={folderDialog} onClose={() => setFolderDialog(false)}>
                <DialogTitle>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>Create New Folder</Typography>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <TextField
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        label=""
                        autoFocus
                        inputProps={{ 'aria-label': 'Without label' }}
                        placeholder="New Folder Name"
                        variant="outlined"
                        sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFolderDialog(false)}>Cancel</Button>
                    <Button variant="outlined" onClick={() => handleCreateFolder()}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditCreateUserFolder;
