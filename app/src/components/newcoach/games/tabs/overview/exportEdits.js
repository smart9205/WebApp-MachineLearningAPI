import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../../../assets/Folder.svg';
import EditsIcon from '../../../../../assets/Edits.svg';

import GameService from '../../../../../services/game.service';

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

const GameExportToEdits = ({ open, onClose, tagList, game }) => {
    const [folders, setFolders] = useState([]);
    const [curEdit, setCurEdit] = useState(null);

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

    const getPeriod = (id) => {
        return id === 1 ? 'H1' : id === 2 ? 'H2' : 'OT';
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }}>
                    {Array.isArray(nodes.children) ? <img src={FolderIcon} style={{ height: '24px' }} /> : <img src={EditsIcon} style={{ height: '24px' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                </Box>
            }
            onClick={() => {
                if (!Array.isArray(nodes.children)) setCurEdit(nodes);
            }}
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    const getName = (item) => {
        return `${item.action_names} - ${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names}`;
    };

    const handleSave = async () => {
        const newList = tagList.map((item, index) => {
            return {
                start_time: item.team_tag_start_time,
                end_time: item.team_tag_end_time,
                edit_id: curEdit.id,
                sort: index,
                game_id: game.id,
                name: getName(item)
            };
        });

        await GameService.addNewEditClips({ id: curEdit.id, rows: newList });
        onClose();
    };

    useEffect(() => {
        GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));

            setFolders(getTreeViewData(ascArray));
        });
    }, []);

    return (
        <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="lg">
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>Export to My Edits</Typography>
            </DialogTitle>
            <DialogContent dividers={true} style={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #E8E8E8', height: '400px', width: '270px', padding: '16px 8px' }}>
                    <TreeView
                        aria-label="rich object"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        sx={{ height: '100%', flexGrow: 1, width: '100%', overflowY: 'auto', color: '#1a1b1d' }}
                    >
                        {folders.length > 0 && folders.map((data) => renderTree(data))}
                    </TreeView>
                </Box>
                <Box sx={{ overflowY: 'auto', maxHeight: '400px', width: '600px', paddingLeft: '16px' }}>
                    <Box sx={{ margin: '0 4px 8px 0', width: 'calc(100% - 4px)' }}>
                        {tagList.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    gap: '8px',
                                    padding: '4px',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '8px'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Box sx={{ background: '#C5EAC6', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'white' }}>{index + 1}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>
                                            {`${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names}`}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>
                                                {`${item.home_team_name} VS ${item.away_team_name}`}
                                            </Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.game_date}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px', width: '80px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.team_tag_start_time}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.team_tag_end_time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleSave()}>
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameExportToEdits;
