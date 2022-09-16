import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/lab';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../assets/Folder.svg';
import EditsIcon from '../../../assets/Edits.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import GameService from '../../../services/game.service';
import EditTagTable from './tagTable';
import EditVideoPlayer from './editVideoPlayer';
import EditNameDialog from './editNameDialog';
import EditCreateUserFolder from './createFolder';

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

const Edits = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editTagList, setEditTagList] = useState([]);
    const [curEdit, setCurEdit] = useState(null);
    const [tagLoading, setTagLoading] = useState(false);
    const [curTagIdx, setCurTagIdx] = useState(0);
    const [playTagList, setPlayTagList] = useState([]);
    const [updateEdit, setUpdateEdit] = useState({});
    const [refreshList, setRefreshList] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [hoverControl, setHoverControl] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [videoData, setVideodata] = useState({
        idx: 0,
        autoPlay: true,
        videoPlay: false
    });

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const getChilds = (folders, parent_id) => {
        const children = folders.filter((item) => item.parent_id === parent_id);
        let trees = [];

        if (children.length > 0) {
            children.map((item) => {
                const childs = getChilds(folders, item.id);
                let tree = { id: String(item.id), name: item.name };

                if (childs.length > 0) tree = { id: String(item.id), name: item.name, children: childs };

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
                let tree = { id: String(item.id), name: item.name };

                if (child.length > 0) tree = { id: String(item.id), name: item.name, children: child };

                trees = [...trees, tree];

                return trees;
            });
        } else {
            let childs = [];
            let node = {};

            other.map((item) => {
                const tree = { id: String(item.id), name: item.name };

                childs = [...childs, tree];

                return childs;
            });
            node = { id: 0, name: 'root', children: childs };

            return node;
        }

        return trees;
    };

    const handleClickRow = (index) => {
        setVideodata({ ...videoData, idx: index });
        setCurTagIdx(index);
    };

    const handleSort = (rows) => {
        GameService.updateEditClipsSort(rows);
    };

    const handleEditName = (node) => {
        setUpdateEdit({ edit: node, isFolder: Array.isArray(node.children) });
        setEditOpen(true);
    };

    const handleDeleteEdit = (id) => {
        setLoading(true);
        GameService.deleteUserEdit(id).then((res) => {
            setLoading(false);
            setRefreshList(!refreshList);
        });
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }} onMouseEnter={() => setHoverIndex(nodes.id)} onMouseLeave={() => setHoverIndex(-1)}>
                    {Array.isArray(nodes.children) ? <img src={FolderIcon} style={{ height: '24px' }} /> : <img src={EditsIcon} style={{ height: '24px' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                    {hoverIndex === nodes.id && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }} onMouseEnter={() => setHoverControl(true)} onMouseLeave={() => setHoverControl(false)}>
                            <Box onClick={() => handleEditName(nodes)}>
                                <EditIcon fontSize="small" />
                            </Box>
                            <Box onClick={() => handleDeleteEdit(nodes.id)}>
                                <DeleteIcon fontSize="small" />
                            </Box>
                        </Box>
                    )}
                </Box>
            }
            onClick={() => {
                if (!Array.isArray(nodes.children) && !hoverControl) setCurEdit(nodes);
            }}
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    useEffect(() => {
        setLoading(true);
        GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));

            setFolders(getTreeViewData(ascArray));
            setLoading(false);
        });
    }, [refreshList]);

    useEffect(() => {
        if (curEdit !== null) {
            setTagLoading(true);
            GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
                if (res.length === 0) setPlayTagList([]);

                setEditTagList(res);
                setTagLoading(false);
                setVideodata({ ...videoData, idx: 0 });
                setCurTagIdx(0);
            });
        }
    }, [curEdit]);

    console.log('Edits => ', curEdit);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>My Edits</Typography>
                    </Box>
                    <EditNameDialog open={editOpen} onClose={() => setEditOpen(false)} node={updateEdit} updateList={setRefreshList} />
                    <EditCreateUserFolder anchor={menuAnchorEl} onClose={() => setMenuAnchorEl(null)} updateList={setRefreshList} />
                    <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', padding: '24px 0', overflowY: 'auto' }}>
                        <div style={{ display: 'flex' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E8E8E8', height: '100%', width: '270px', padding: '16px 8px' }}>
                                <TreeView
                                    aria-label="rich object"
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpanded={['root']}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                    defaultEndIcon={<div style={{ width: 24 }} />}
                                    sx={{ height: '100%', flexGrow: 1, width: '100%', overflowY: 'auto', color: '#1a1b1d' }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setMenuAnchorEl(e.currentTarget);
                                    }}
                                >
                                    {folders.length > 0 && folders.map((data) => renderTree(data))}
                                </TreeView>
                            </Box>
                            <EditTagTable
                                loading={tagLoading}
                                tagList={editTagList}
                                setList={setPlayTagList}
                                setIdx={handleClickRow}
                                selected={curTagIdx}
                                sort={handleSort}
                                name={curEdit?.name ?? ''}
                            />
                        </div>
                        <EditVideoPlayer videoData={videoData} tagList={playTagList} onChangeClip={(idx) => setCurTagIdx(idx)} drawOpen={true} />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Edits;
