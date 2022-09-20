import React, { useState } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

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

const EditCreateUserFolderEdit = ({ open, onClose, updateList, isFolder, node }) => {
    const [folderName, setFolderName] = useState('');

    const getChilds = (folders, parent_id) => {
        const children = folders.filter((item) => item.parent_id === parent_id);
        let trees = [];

        if (children.length > 0) {
            children.map((item) => {
                const childs = getChilds(folders, item.id);
                let tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type };

                if (childs.length > 0) tree = { id: String(item.id), name: item.name, children: childs, order_num: item.order_number, type: item.type };

                trees = [...trees, tree];

                return trees;
            });
        }

        return trees;
    };

    const getTreeViewData = (res) => {
        const parents = res.filter((item) => item.parent_id === null);
        const other = res.filter((item) => item.parent_id !== null);
        let trees = [];

        if (parents.length > 0) {
            parents.map((item) => {
                const child = getChilds(other, item.id);
                let tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type };

                if (child.length > 0) tree = { id: String(item.id), name: item.name, children: stableSort(child, getComparator('asc', 'order_num')), order_num: item.order_number, type: item.type };

                trees = [...trees, tree];

                return trees;
            });
        } else {
            let childs = [];

            other.map((item) => {
                const tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type };

                childs = [...childs, tree];

                return childs;
            });

            return { id: 0, name: 'root', children: stableSort(childs, getComparator('asc', 'order_num')), type: 'folder' };
        }

        return stableSort(trees, getComparator('asc', 'order_num'));
    };

    const handleCreateFolder = async () => {
        if (isFolder) await GameService.createUserFolder({ name: folderName, parent_id: node !== null && node.type === 'folder' ? node.id : null });
        else await GameService.createUserEdit({ name: folderName, parent_id: node !== null && node.type === 'folder' ? node.id : null });

        await GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));

            onClose();
            updateList(getTreeViewData(ascArray));
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>Create New {isFolder ? 'Folder' : 'Edit'}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateFolder();
                        }
                    }}
                    label=""
                    autoFocus
                    inputProps={{ 'aria-label': 'Without label' }}
                    placeholder="New Folder Name"
                    variant="outlined"
                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleCreateFolder()}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCreateUserFolderEdit;
