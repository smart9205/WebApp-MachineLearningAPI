import { Box, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import gameService from '../../../services/game.service';
import { Button, Grid } from '@mui/material';
import { Paper, IconButton, Table, TableBody, TableRow, TableCell, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateEditDialog from './tabs/createEditDialog';
import EditNameDialog from "../../../common/EditNameDialolg";
import DeleteConfirmDialog from "../../../common/DeleteConfirmDialog";
import DragableTeamTagTable from './tabs/DragableTeamTagTable';
import DragableIndividualTagTable from './tabs/DragableIndividualTagTable'
import VideoPlayer from './tabs/UserEditVideoPlayer';
import { createCommand, toSecond } from '../../../common/utilities';

const Edits = () => {

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamList: [],
        team: []
    })
    const { teamList, team } = state

    const [open, setOpen] = useState(false)
    const [curEdit, setCurEdit] = useState(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editName, setEditName] = useState("")
    const [editOpen, setEditOpen] = useState(false)
    const [editList, setEditList] = useState([])
    const [showAccordion, setShowAccordion] = useState(true)
    const [curTagIdx, setCurTagIdx] = useState(0)
    const [tagList, setTagList] = useState([])

    const [parentId, setParentId] = useState(0)
    const [folder, setFolder] = useState([])
    const [name, setName] = useState("")
    const [nameOpen, setNameOpen] = useState(false)

    const [videoData, setVideodata] = useState({
        idx: 0,
        autoPlay: true,
        videoPlay: false,
    })

    useEffect(() => {
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] })
        })
    }, [])

    const handleSort = (rows) => {
        gameService.updateEditClipsSort(rows).then(res => console.log(res))
    }

    const handleDeleteEditClips = (id) => {
        gameService.deleteEditClip(id).then(res => {
            handleUserEditDetail(curEdit)
        })
    }

    const handleVideoData = (type, play, idx) => {
        setCurTagIdx(idx)
        setVideodata({ idx, autoPlay: true, videoPlay: play })
    }

    const handleDeleteClose = (result) => {
        setDeleteOpen(false)
        if (result) {
            gameService.deleteUserEdit(curEdit.id).then(res => {
                initUserEdits()
            }).catch(e => console.log(e))
        }
    }

    const handleEditClose = (name) => {
        setEditOpen(false)
        if (name.length === 0) return
        gameService.updateUserEdit({ id: curEdit.id, name }).then(res => {
            initUserEdits()
        })
    }

    const handleUserEditDetail = (edit) => {
        setParentId(edit?.id)
        if (!edit) return
        setCurEdit(edit)
        gameService.getEditClipsByUserEditId(edit?.id ?? -1).then(res => {
            setCurTagIdx(0)
            const ttag = res.filter(t => t.team_tag_id !== null)
            const ptag = res.filter(t => t.player_tag_id !== null)
            setTagList(ttag.length > 0 ? ttag : ptag,)
            setVideodata({ idx: 0, autoPlay: true, videoPlay: false })
        })
    }

    const initUserEdits = () => {
        gameService.getAllUserEdits().then(res => {
            console.log("res-", res[0] ?? -1)
            setEditList(res)
            setCurEdit(res[0] ?? -1)
            handleUserEditDetail(res[0] ?? -1)
        })

    }

    useEffect(initUserEdits, [])

    const handleEditOpen = (flag) => {
        setOpen(flag)
        if (!flag) initUserEdits()
    }

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

    useEffect(() => {
        const gettingFolder = async () => {
            await gameService.getAllUserEditsFolders(parentId).then(res => {
                setFolder(res)
                console.log('Folder -> ', res)
            }).catch(e => console.log(e))
        }
        gettingFolder()
    }, [parentId])

    const handleCreateFolder = () => {
        gameService.addUserEditsFolder({ name, parentId }).then(res => {
            console.log('Response -> ', res)
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        console.log(folder)
    }, [folder])

    return (
        <>

            <CreateEditDialog
                open={open}
                handleEditOpen={handleEditOpen}
                teamList={teamList}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                handleDeleteClose={handleDeleteClose}
            />

            <EditNameDialog
                open={editOpen}
                name={editName}
                setName={setEditName}
                handleEditClose={handleEditClose}
            />

            <Dialog
                fullWidth
                maxWidth={"sm"}
                open={nameOpen}
                onClose={() => setNameOpen(false)}
            >
                <DialogTitle>Name</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNameOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder}>OK</Button>
                </DialogActions>
            </Dialog >

            <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
                <Box sx={{ padding: '24px 24px 18px 18px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Edits</Typography>
                    <Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '18px', borderRadius: '10px', margin: '0 24px 24px', height: '100%' }}>

                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={2}>
                                <Button variant="outlined" style={{ marginBottom: '10px' }} onClick={() => handleEditOpen(true)}>Create Edits</Button>

                                <Button variant="outlined" style={{ marginBottom: '10px' }} onClick={() => setNameOpen(true)}>Create Folder</Button>

                                <Box>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                {editList.map((userEdit, idx) => (
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
                                    <Button variant="contained" style={{ margin: '1rem 0.5rem' }} onClick={handleRender}>
                                        Render
                                    </Button>
                                </Box>

                            </Grid>
                            <Grid item xs={4}>
                                {tagList.length === 0 && <p style={{ textAlign: 'center' }}>NoTags</p>}
                                {tagList.filter(t => t.team_tag_id !== null).length > 0 &&
                                    <DragableTeamTagTable
                                        sx={{ height: "100%", p: 1, width: "100%" }}
                                        rows={tagList}
                                        onDelete={id => handleDeleteEditClips(id)}
                                        handleSort={handleSort}
                                        handleRowClick={({ row, idx }) => handleVideoData("teamTag", false, idx)}
                                        selected={curTagIdx}
                                        onPlay={({ row, idx }) => handleVideoData("teamTag", true, idx)}
                                        initUserEdits={initUserEdits}
                                    />
                                }
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
                                    />
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <VideoPlayer
                                    videoData={videoData}
                                    tagList={tagList}
                                    onChangeClip={(idx) => setCurTagIdx(idx)}
                                    drawOpen={showAccordion}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Edits;
