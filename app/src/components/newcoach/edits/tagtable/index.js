import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';

import DeleteIcon from '@mui/icons-material/Delete';
import ExportIcon from '@mui/icons-material/FileDownloadOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../../assets/Folder.svg';
import EditsIcon from '../../../../assets/Edits.svg';

import CoachTeamTagTable from './teamTagTable';
import { editCreateCommand, toSecond } from '../../components/utilities';
import GameService from '../../../../services/game.service';

const EditTagTable = ({ loading, tagList, setIdx, selected, sort, name, update, folders }) => {
    const [teamTagList, setTeamTagList] = useState([]);
    const [checkArray, setCheckArray] = useState([]);
    const [eventName, setEventName] = useState('');
    const [controlEdit, setControlEdit] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleRender = () => {
        let newList = [];
        const temp = checkArray.length === 0 ? teamTagList : teamTagList.filter((item) => checkArray.includes(item.id) === true);

        temp.map((tag) => {
            let last = newList.at(-1);

            if (last && toSecond(last?.end_time ?? 0) >= toSecond(tag.start_time) && toSecond(last?.start_time ?? 0) <= toSecond(tag.start_time)) {
                last.end_time = last.end_time > tag.end_time ? last.end_time : tag.end_time;
            } else {
                newList.push({ ...tag });
            }
        });

        editCreateCommand(newList, name);
    };

    const handleDelete = () => {
        if (checkArray.length === 0) {
            window.alert('Please select clips to delete');

            return;
        }

        const newList = teamTagList.filter((item) => checkArray.includes(item.id) === true);

        setTeamTagList(teamTagList.filter((item) => checkArray.includes(item.id) === false));
        newList.map(async (item) => await GameService.deleteEditClip(item.id));
    };

    const handleCopy = async () => {
        setEventName('copy');

        if (checkArray.length === 0) {
            window.alert('Please select clips to copy to other edit');

            return;
        }

        if (controlEdit === null) {
            setDialogOpen(true);

            return;
        }

        let newList = teamTagList.filter((item) => checkArray.includes(item.id) === true).map((item) => item.id);

        await GameService.copyEditClips(newList.join(','), controlEdit.id);
        setControlEdit(null);
        setEventName('');

        return;
    };

    const handleMove = async () => {
        setEventName('move');

        if (checkArray.length === 0) {
            window.alert('Please select clips to move to other edit');

            return;
        }

        if (controlEdit === null) {
            setDialogOpen(true);

            return;
        }

        let newList = teamTagList.filter((item) => checkArray.includes(item.id) === true).map((item) => item.id);

        setTeamTagList(teamTagList.filter((item) => checkArray.includes(item.id) === false));
        await GameService.moveEditClips(newList.join(','), controlEdit.id);
        setControlEdit(null);
        setEventName('');
    };

    const handleSave = () => {
        if (controlEdit === null) {
            window.alert("You didn't select any edit. Please select.");

            return;
        }

        setDialogOpen(false);
        eventName === 'copy' ? handleCopy() : handleMove();
    };

    const handleClose = () => {
        setControlEdit(null);
        setDialogOpen(false);
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }}>
                    {nodes.type === 'folder' ? <img src={FolderIcon} style={{ height: '24px' }} /> : <img src={EditsIcon} style={{ height: '24px' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                </Box>
            }
            onClick={() => {
                if (nodes.type === 'edit') setControlEdit(nodes);
            }}
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    useEffect(() => {
        setTeamTagList(tagList);
    }, [tagList]);

    console.log(checkArray);

    return (
        <Box sx={{ width: '500px', height: '100%', padding: '16px 8px', borderLeft: '1px solid #E8E8E8', textAlign: 'center' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    {teamTagList.length === 0 && (
                        <Box sx={{ width: '100%', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>No Tags</Typography>
                        </Box>
                    )}
                    {teamTagList.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleRender}>
                                <ExportIcon />
                                Render
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleMove}>
                                <ContentCutIcon />
                                Move
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleCopy}>
                                <ContentCopyIcon />
                                Copy
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleDelete}>
                                <DeleteIcon />
                                Delete
                            </Button>
                        </Box>
                    )}
                    {tagList.length > 0 && teamTagList.length > 0 && (
                        <CoachTeamTagTable tagList={teamTagList} setIndex={setIdx} selectIdx={selected} handleSort={sort} updateTable={update} setChecks={setCheckArray} />
                    )}
                    <Dialog open={dialogOpen} onClose={() => handleClose()} scroll="paper">
                        <DialogTitle>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>Select Edit</Typography>
                        </DialogTitle>
                        <DialogContent dividers={true} style={{ display: 'flex' }}>
                            <Box sx={{ height: '400px', width: '270px', padding: '0 8px' }}>
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
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleClose()}>Cancel</Button>
                            <Button variant="outlined" onClick={() => handleSave()}>
                                {eventName === 'copy' ? 'Copy' : 'Move'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default EditTagTable;
