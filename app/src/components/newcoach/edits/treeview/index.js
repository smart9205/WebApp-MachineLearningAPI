import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Box, Typography, Button, CircularProgress, Divider, Popover, Snackbar, Alert } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../../assets/Folder.svg';
import EditsIcon from '../../../../assets/Edits.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindowsOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import GameService from '../../../../services/game.service';
import { getComparator, stableSort } from '../../components/utilities';
import EditCreateUserFolderEdit from './createFolder';
import EditNameDialog from './editNameDialog';
import DeleteConfirmDialog from '../../../../common/DeleteConfirmDialog';
import EditShareDialog from './shareDialog';

let child_ids = [];

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

function getChildIds(array) {
    array.map((item) => {
        if (Array.isArray(item.children)) getChildIds(item.children);

        child_ids = [...child_ids, item.id];
    });
}

export function getTreeViewData(res) {
    let resCopy = [...res];
    let trees = [];

    child_ids = [];

    for (let i = 0; i < resCopy.length; i += 1) {
        const child = getChilds(resCopy, resCopy[i].id);
        let tree = { id: String(resCopy[i].id), name: resCopy[i].name, order_num: resCopy[i].order_number, type: resCopy[i].type, parent_id: resCopy[i].parent_id };

        if (child.length > 0)
            tree = {
                id: String(resCopy[i].id),
                name: resCopy[i].name,
                children: stableSort(child, getComparator('asc', 'order_num')),
                order_num: resCopy[i].order_number,
                type: resCopy[i].type,
                parent_id: resCopy[i].parent_id
            };

        trees = [...trees, tree];
        getChildIds(child);
        child_ids = [...child_ids, tree.id];
        resCopy = resCopy.filter((data) => child_ids.includes(String(data.id)) === false);
        i = -1;
    }

    return stableSort(trees, getComparator('asc', 'order_num'));
}

const EditFolderTreeView = ({ setEdit, isMain, entireHeight, treeHeight, t }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [folderDialog, setFolderDialog] = useState(false);
    const [createFolderEdit, setCreateFolderEdit] = useState(false);
    const [curEdit, setCurEdit] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [updateEdit, setUpdateEdit] = useState({});
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

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

    const handleShareEdit = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleShareEditByMessage = () => {
        setMenuAnchorEl(null);
        GameService.getShareURL(curEdit.id).then((res) => {
            navigator.clipboard.writeText(res);
            setAlertOpen(true);
        });
    };

    const handleCreateEmbedCode = () => {
        GameService.getShareURL(curEdit.id).then((res) => {
            const message = `<iframe src="${res}" width="720" height="400" frameborder="0" allow="autoplay" allowfullscreen></iframe>`;

            navigator.clipboard.writeText(message);
            setAlertOpen(true);
        });
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={`${nodes.id}_${nodes.type}`}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }}>
                    {nodes.type === 'folder' ? <img src={FolderIcon} style={{ height: '1.2rem' }} /> : <img src={EditsIcon} style={{ height: '1.2rem' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                    {isMain && hoverIndex === nodes.id && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box onClick={() => handleEditName(nodes)}>
                                <EditIcon fontSize="small" />
                            </Box>
                            <Box onClick={() => setConfirmOpen(true)}>
                                <DeleteIcon fontSize="small" />
                            </Box>
                            {nodes.type === 'edit' && (
                                <>
                                    <Box onClick={handleShareEdit}>
                                        <ShareIcon fontSize="small" />
                                    </Box>
                                    <Box onClick={() => handleCreateEmbedCode()}>
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

            console.log('edit tree => ', ascArray);
            setFolders(array);
            setLoading(false);
        });
    }, []);

    console.log('edit tree => ', curEdit);

    return (
        <>
            <Box sx={{ height: entireHeight, width: '260px', padding: '16px 5px' }}>
                {loading ? (
                    <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                            <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ width: '100%' }}>
                                {t('Successfully copied URL')}
                            </Alert>
                        </Snackbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 10px 24px' }}>
                            <Button
                                variant="contained"
                                sx={{ fontSize: '0.75rem !important', background: '#C5EAC6', color: '#0A7304', '&:hover': { background: '#0A7304', color: '#fff' } }}
                                onClick={() => {
                                    setCreateFolderEdit(true);
                                    setFolderDialog(true);
                                }}
                            >
                                {t('New Folder')}
                            </Button>
                            <Button
                                variant="contained"
                                disabled={curEdit === null || curEdit.type === 'edit'}
                                sx={{ fontSize: '0.75rem !important', background: '#C5EAC6', color: '#0A7304', '&:hover': { background: '#0A7304', color: '#fff' } }}
                                onClick={() => {
                                    setCreateFolderEdit(false);
                                    setFolderDialog(true);
                                }}
                            >
                                {t('New Edit')}
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
            <EditNameDialog t={t} open={editOpen} onClose={() => setEditOpen(false)} node={updateEdit} nodes={folders} updateList={setFolders} />
            <EditCreateUserFolderEdit t={t} open={folderDialog} onClose={() => setFolderDialog(false)} updateList={setFolders} isFolder={createFolderEdit} node={curEdit} />
            <DeleteConfirmDialog
                open={confirmOpen}
                handleDeleteClose={(flag) => {
                    setConfirmOpen(false);

                    if (flag) handleDeleteEditFolder(curEdit);
                }}
            />
            <EditShareDialog open={shareOpen} onClose={() => setShareOpen(false)} edit={curEdit} />
            <Popover
                id={menuPopoverId}
                open={menuPopoverOpen}
                anchorEl={menuAnchorEl}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ '& .MuiPopover-paper': { width: '200px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
            >
                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }}
                    onClick={() => {
                        setMenuAnchorEl(null);
                        setShareOpen(true);
                    }}
                >
                    <EmailIcon />
                    <p className="normal-text">{t('By email')}</p>
                </Box>
                <Divider sx={{ width: '100%' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleShareEditByMessage()}>
                    <ChatBubbleIcon />
                    <p className="normal-text">{t('By message')}</p>
                </Box>
            </Popover>
        </>
    );
};

export default EditFolderTreeView;
