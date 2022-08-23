import { Box, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import gameService from '../../../services/game.service';
import { Button, Grid } from '@mui/material';
import CreateEditDialog from './tabs/createEditDialog';
import UserEditList from './tabs/userEditList';
import EditNameDialog from "../../../common/EditNameDialolg";
import DeleteConfirmDialog from "../../../common/DeleteConfirmDialog";

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

            <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
                <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Edits</Typography>
                    <Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '18px', borderRadius: '10px', margin: '0 24px 24px', height: '100%' }}>

                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={3}>
                                <Button variant="outlined" style={{ marginBottom: '10px' }} onClick={() => handleEditOpen(true)}>Create Edits</Button>
                                <Box>
                                    <UserEditList
                                        editList={editList}
                                        curEdit={curEdit}
                                        handleUserEditDetail={handleUserEditDetail}
                                        setEditOpen={setEditOpen}
                                        setEditName={setEditName}
                                        setDeleteOpen={setDeleteOpen}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <h1 style={{ color: 'black' }}>Edits</h1>
                            </Grid>
                            <Grid item xs={4}>
                                <h1 style={{ color: 'black' }}>Video</h1>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Edits;
