import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, IconButton, Button, Table, TableBody, TableRow, TableCell, TableContainer, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VideoPlayer from './UserEditVideoPlayer';
import CreateEditDialog from '../createEditDialog';
import CreateQuickEditDialog from '../createQuickEditDialog';
import gameService from '../../../../services/game.service';
import DeleteConfirmDialog from '../../../../common/DeleteConfirmDialog';
import EditNameDialog from '../../../../common/EditNameDialolg';
import DragableIndividualTagTable from './DragableIndividualTagTable';
import DragableTeamTagTable from './DragableTeamTagTable';
import { createCommand, toSecond } from '../../../../common/utilities';

const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

const MyEditsTab = ({ teamList, game, playerList, t }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [quickOpen, setQuickOpen] = useState(false);
    const [curEdit, setCurEdit] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [userEditList, setUserEditList] = useState([]);
    const [showAccordion, setShowAccordion] = useState(true);
    const [curTagIdx, setCurTagIdx] = useState(0);
    const [tagList, setTagList] = useState([]);

    const [videoData, setVideodata] = useState({
        idx: 0,
        autoPlay: true,
        videoPlay: false
    });

    const initUserEdits = () => {
        setLoading(true);
        gameService.getAllUserEdits().then((res) => {
            setUserEditList(res);
            setCurEdit(res[0] ?? -1);
            handleUserEditDetail(res[0] ?? -1);
            setLoading(false);
        });
    };

    useEffect(initUserEdits, []);

    const handleEditOpen = (flag) => {
        setOpen(flag);
        if (!flag) initUserEdits();
    };

    const handleQuickEditOpen = (flag) => {
        setQuickOpen(flag);
        if (!flag) initUserEdits();
    };

    const handleUserEditDetail = (edit) => {
        if (!edit) return;
        setCurEdit(edit);
        gameService.getEditClipsByUserEditId(edit?.id ?? -1).then((res) => {
            setCurTagIdx(0);
            const ttag = res.filter((t) => t.team_tag_id !== null);
            const ptag = res.filter((t) => t.player_tag_id !== null);
            setTagList(ttag.length > 0 ? ttag : ptag);
            setVideodata({ idx: 0, autoPlay: true, videoPlay: false });
        });
    };

    const handleDeleteClose = (result) => {
        setDeleteOpen(false);
        if (result) {
            setLoading(true);
            gameService
                .deleteUserEdit(curEdit.id)
                .then((res) => {
                    setLoading(false);
                    initUserEdits();
                })
                .catch((e) => setLoading(false));
        }
    };

    const handleEditClose = (name) => {
        setEditOpen(false);
        if (name.length === 0) return;
        setLoading(true);
        gameService.updateUserEdit({ id: curEdit.id, name }).then((res) => {
            setLoading(false);
            initUserEdits();
        });
    };

    const handleDeleteEditClips = (id) => {
        gameService.deleteEditClip(id).then((res) => {
            handleUserEditDetail(curEdit);
        });
    };

    const handleVideoData = (type, play, idx) => {
        setCurTagIdx(idx);
        setVideodata({ idx, autoPlay: true, videoPlay: play });
    };

    const handleSort = (rows) => {
        gameService.updateEditClipsSort(rows);
    };

    const handleRender = () => {
        if (!tagList.length) return;

        let newList = [];

        tagList.forEach((tag, i) => {
            let last = newList.at(-1);
            if (last && toSecond(last?.end_time ?? 0) >= toSecond(tag.start_time) && toSecond(last?.start_time ?? 0) <= toSecond(tag.start_time)) {
                last.end_time = last.end_time > tag.end_time ? last.end_time : tag.end_time;

                if (last.action_name && !last.action_name?.includes(tag.action_name)) last.action_name += ` && ${tag.action_name}`;
            } else {
                newList.push({ ...tag });
            }
        });

        createCommand(newList, curEdit.name);
    };

    return (
        <>
            {loading && (
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            )}
            <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
            <EditNameDialog open={editOpen} name={editName} setName={setEditName} handleEditClose={handleEditClose} />
            <CreateEditDialog open={open} handleEditOpen={handleEditOpen} teamList={teamList} t={t} />

            <Box style={{ minWidth: 240, overflowY: 'scroll', fontSize: 12, display: showAccordion ? '' : 'none', paddingRight: 8 }}>
                <h5 style={{ color: 'black', margin: '0.5rem 1rem' }}>{t('Edits')}</h5>
                <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '2px', marginBottom: '5px' }}>
                    <Button variant="outlined" onClick={() => handleEditOpen(true)}>
                        {t('NewEdit')}
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {userEditList.map((userEdit, idx) => (
                                <TableRow key={idx} hover selected={curEdit === userEdit} onClick={() => handleUserEditDetail(userEdit)}>
                                    <TableCell align="center">{userEdit.name}</TableCell>
                                    <TableCell align="center" sx={{ width: 30 }}>
                                        <IconButton
                                            onClick={() => {
                                                setEditOpen(true);
                                                setEditName(userEdit.name);
                                            }}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 30 }}>
                                        <IconButton onClick={() => setDeleteOpen(true)} size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {document.body.style.direction === 'ltr' ? (
                <IconButton onClick={() => setShowAccordion((v) => !v)} sx={{ background: '#8080804d', zIndex: 10, position: 'absolute', left: showAccordion ? 250 : 10 }}>
                    {showAccordion ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                </IconButton>
            ) : (
                <IconButton onClick={() => setShowAccordion((v) => !v)} sx={{ background: '#8080804d', zIndex: 10, position: 'absolute', right: showAccordion ? 250 : 10 }}>
                    {showAccordion ? <ArrowRightIcon /> : <ArrowLeftIcon />}
                </IconButton>
            )}
            <Box style={{ textAlign: 'center' }}>
                <Paper style={{ height: 'calc(95vh - 200px)', minWidth: 540 }} className="coach-tag-table">
                    {tagList.length === 0 && <p style={{ textAlign: 'center' }}>{t('NoTags')}</p>}
                    {tagList.filter((t) => t.team_tag_id !== null).length > 0 && (
                        <DragableTeamTagTable
                            sx={{ height: '100%', p: 1, width: '100%' }}
                            rows={tagList}
                            onDelete={(id) => handleDeleteEditClips(id)}
                            handleSort={handleSort}
                            handleRowClick={({ row, idx }) => handleVideoData('teamTag', false, idx)}
                            selected={curTagIdx}
                            onPlay={({ row, idx }) => handleVideoData('teamTag', true, idx)}
                            initUserEdits={initUserEdits}
                            t={t}
                        />
                    )}
                    {tagList.filter((t) => t.player_tag_id !== null).length > 0 && (
                        <DragableIndividualTagTable
                            sx={{ height: '100%', p: 1, width: '100%' }}
                            rows={tagList}
                            selected={curTagIdx}
                            handleSort={handleSort}
                            onDelete={(id) => handleDeleteEditClips(id)}
                            handleRowClick={({ row, idx }) => handleVideoData('playerTag', false, idx)}
                            onPlay={({ row, idx }) => handleVideoData('playerTag', true, idx)}
                            initUserEdits={initUserEdits}
                            t={t}
                        />
                    )}
                </Paper>
                <Button variant="contained" style={{ margin: '1rem 0.5rem' }} onClick={handleRender}>
                    {t('Render')}
                </Button>
            </Box>
            <VideoPlayer videoData={videoData} tagList={tagList} onChangeClip={(idx) => setCurTagIdx(idx)} drawOpen={showAccordion} />
        </>
    );
};

export default MyEditsTab;
