import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../../assets/Folder.svg';
import EditsIcon from '../../../../assets/Edits.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';

import GameService from '../../../../services/game.service';
import { getComparator, stableSort } from '../../components/utilities';
import EditCreateUserFolderEdit from './createFolder';
import EditNameDialog from './editNameDialog';

function getChilds(folders, parent_id) {
    const children = folders.filter((item) => item.parent_id === parent_id);
    let trees = [];

    if (children.length > 0) {
        children.map((item) => {
            const childs = getChilds(folders, item.id);
            let tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type, parent_id: item.parent_id };

            if (childs.length > 0) tree = { id: String(item.id), name: item.name, children: childs, order_num: item.order_number, type: item.type, parent_id: item.parent_id };

            trees = [...trees, tree];

            return trees;
        });
    }

    return stableSort(trees, getComparator('asc', 'order_num'));
}

export function getTreeViewData(res) {
    const parents = res.filter((item) => item.parent_id === null);
    const other = res.filter((item) => item.parent_id !== null);
    let trees = [];

    if (parents.length > 0) {
        parents.map((item) => {
            const child = getChilds(other, item.id);
            let tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type, parent_id: item.parent_id };

            if (child.length > 0)
                tree = {
                    id: String(item.id),
                    name: item.name,
                    children: stableSort(child, getComparator('asc', 'order_num')),
                    order_num: item.order_number,
                    type: item.type,
                    parent_id: item.parent_id
                };

            trees = [...trees, tree];

            return trees;
        });
    } else {
        let childs = [];

        other.map((item) => {
            const tree = { id: String(item.id), name: item.name, order_num: item.order_number, type: item.type, parent_id: item.parent_id };

            childs = [...childs, tree];

            return childs;
        });

        return { id: 0, name: 'root', children: stableSort(childs, getComparator('asc', 'order_num')), type: 'folder' };
    }

    return stableSort(trees, getComparator('asc', 'order_num'));
}

const EditFolderTreeView = ({ setEdit, isMain, entireHeight, treeHeight }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [folderDialog, setFolderDialog] = useState(false);
    const [createFolderEdit, setCreateFolderEdit] = useState(false);
    const [curEdit, setCurEdit] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [hoverControl, setHoverControl] = useState(false);
    const [updateEdit, setUpdateEdit] = useState({});
    const [editOpen, setEditOpen] = useState(false);

    const handleSetCurEdit = (edit) => {
        setCurEdit(edit);
        setEdit(edit);
    };

    const handleEditName = (node) => {
        setUpdateEdit({ edit: node, isFolder: Array.isArray(node.children) });
        setEditOpen(true);
    };

    const deleteFolderEdit = (array, node) => {
        const index = array.indexOf(node);

        if (index > -1) return array.splice(index, 1);

        return array.map((item) => {
            if (Array.isArray(item.children)) {
                const idx = item.children.indexOf(node);

                if (idx > -1) return item.children.splice(idx, 1);
                else return deleteFolderEdit(item.children, node);
            }
        });
    };

    const handleDeleteEditFolder = async (node) => {
        let array = [...folders];

        deleteFolderEdit(array, node);
        setFolders(array);

        if (node.type === 'edit') await GameService.deleteUserEdit(node.id);
        else await GameService.deleteUserFolder(node.id);

        handleSetCurEdit(null);
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={`${nodes.id}_${nodes.type}`}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }}>
                    {nodes.type === 'folder' ? <img src={FolderIcon} style={{ height: '24px' }} /> : <img src={EditsIcon} style={{ height: '24px' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                    {isMain && hoverIndex === nodes.id && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box onClick={() => handleEditName(nodes)}>
                                <EditIcon fontSize="small" />
                            </Box>
                            <Box onClick={() => handleDeleteEditFolder(nodes)}>
                                <DeleteIcon fontSize="small" />
                            </Box>
                            {nodes.type === 'edit' && (
                                <>
                                    <Box>
                                        <ShareIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <DesktopWindowsIcon fontSize="small" />
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            }
            onClick={() => {
                if (isMain) setHoverIndex(nodes.id);

                handleSetCurEdit(nodes);
            }}
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    useEffect(() => {
        setLoading(true);
        GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));
            const array = getTreeViewData(ascArray);

            setFolders(array);
            setLoading(false);
        });
    }, []);

    console.log(curEdit);

    return (
        <>
            <Box sx={{ height: entireHeight, width: '300px', padding: '16px 8px' }}>
                {loading ? (
                    <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 16px 24px' }}>
                            <Button
                                variant="contained"
                                sx={{ background: '#C5EAC6', '&:hover': { background: '#0A7304' } }}
                                onClick={() => {
                                    setFolderDialog(true);
                                    setCreateFolderEdit(true);
                                }}
                            >
                                New Folder
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ background: '#C5EAC6', '&:hover': { background: '#0A7304' } }}
                                onClick={() => {
                                    setFolderDialog(true);
                                    setCreateFolderEdit(false);
                                }}
                            >
                                New Edit
                            </Button>
                        </Box>
                        <TreeView
                            aria-label="rich object"
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpanded={['root']}
                            defaultExpandIcon={<ChevronRightIcon />}
                            defaultEndIcon={<div style={{ width: 24 }} />}
                            sx={{ height: treeHeight, flexGrow: 1, width: '100%', overflowY: 'auto', color: '#1a1b1d' }}
                        >
                            {folders.length > 0 && folders.map((data) => renderTree(data))}
                        </TreeView>
                    </>
                )}
            </Box>
            <EditNameDialog open={editOpen} onClose={() => setEditOpen(false)} node={updateEdit} nodes={folders} updateList={setFolders} />
            <EditCreateUserFolderEdit open={folderDialog} onClose={() => setFolderDialog(false)} updateList={setFolders} isFolder={createFolderEdit} node={curEdit} />
        </>
    );
};

export default EditFolderTreeView;
