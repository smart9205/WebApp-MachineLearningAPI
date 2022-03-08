import React, { useState, useReducer, useEffect } from "react";

import {
    Paper,
    Box,
    IconButton,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TeamTagTable from '../TeamTagTable';
import VideoPlayer from '../VideoPlayer';
import CreateEditDialog from "./createEditDialog";
import gameService from "../../../services/game.service";
import DeleteConfirmDialog from "../../../common/DeleteConfirmDialog";
import EditNameDialog from "../../../common/EditNameDialolg";

const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
};

const MyEditsTab = ({ teamList, game, playerList }) => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [curEdit, setCurEdit] = useState(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editName, setEditName] = useState("")
    const [editOpen, setEditOpen] = useState(false)
    const [userEditList, setUserEditList] = useState([])
    const [showAccordion, setShowAccordion] = useState(true)
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0)
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamTagList: [],
        actionTagList: [],
    })
    const { teamTagList, actionTagList, } = state

    const [videoData, setVideodata] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        autoPlay: true,
        tagList: [],
        videoPlay: false,
    })

    const initUserEdits = () => {
        setLoading(true)
        gameService.getAllUserEdits().then(res => {
            console.log("all user Edits", res)
            setUserEditList(res)
            setLoading(false)
        })
    }

    useEffect(initUserEdits, [])

    const handleOpen = (flag) => {
        setOpen(flag)
        if (!flag) initUserEdits()
    }

    const handleUserEditDetail = (edit) => {
        setCurEdit(edit)
        gameService.getEditClipsByUserEditId(edit.id).then(res => {
            console.log("get EditClipsby userEditid", res)
        })
    }

    const handleDeleteClose = () => {
        setLoading(true)
        setDeleteOpen(false)
        gameService.deleteUserEdit(curEdit.id).then(res => {
            setLoading(false)
            initUserEdits()
        }).catch(e => setLoading(false))
    }

    const handleEditClose = (name) => {
        setEditOpen(false)
        if (name.length === 0) return
        setLoading(true)
        gameService.updateUserEdit({ id: curEdit.id, name }).then(res => {
            setLoading(false)
            initUserEdits()
        })
    }

    return (
        <>
            {loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
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
            <CreateEditDialog
                open={open}
                handleOpen={handleOpen}
                teamList={teamList}
            />
            <Box
                style={{ minWidth: 240, overflowY: "scroll", fontSize: 12, display: showAccordion ? "" : "none", paddingRight: 8 }}>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ color: 'black', margin: '0.5rem 1rem' }}>My Edits</h5>
                    <Button variant="outlined" onClick={() => handleOpen(true)}>New Edits</Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {userEditList.map((userEdit, idx) =>
                                <TableRow
                                    key={idx}
                                    hover
                                    onClick={() => handleUserEditDetail(userEdit)}
                                >
                                    <TableCell align="center">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell align="center">{userEdit.name}</TableCell>
                                    <TableCell align="center" sx={{ width: 30 }}>
                                        <IconButton
                                            onClick={() => {
                                                setEditOpen(true)
                                                setEditName(userEdit.name)
                                            }}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 30 }}>
                                        <IconButton
                                            onClick={() => setDeleteOpen(true)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <IconButton
                onClick={() => setShowAccordion((v) => !v)}
                sx={{ background: '#8080804d', zIndex: 10, position: "absolute", left: showAccordion ? 250 : 10 }}>
                {showAccordion ?
                    <ArrowLeftIcon /> :
                    <ArrowRightIcon />
                }
            </IconButton>
            <Paper style={{ height: "100%", minWidth: 500 }} className="coach-tag-table">
                <TeamTagTable
                    sx={{ height: "70%", p: 1, width: "100%" }}
                    rows={teamTagList}
                    updateTagList={(newTeamTag) => { teamTagList.find(t => t.team_tag_id === newTeamTag.team_tag_id) }}
                    handleRowClick={({ row, idx }) => {
                        setCurTeamTagIdx(idx)
                        setVideodata({
                            idx,
                            tagList: teamTagList.map(t => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                }
                            }),
                            autoPlay: true,
                            videoPlay: false,
                        })
                    }
                    }
                    selected={curTeamTagIdx}
                    onPlay={({ row, idx }) => {
                        console.log("onplay", row, idx)
                        setCurTeamTagIdx(idx)
                        setVideodata({
                            idx,
                            tagList: teamTagList.map(t => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                }
                            }),
                            cnt: new Date(),
                            autoPlay: true,
                            videoPlay: true,
                        })
                    }}
                />

            </Paper>
            <VideoPlayer
                videoData={videoData}
                url={game?.video_url ?? ""}
                onChangeClip={(idx) => setCurTeamTagIdx(idx)}
            />
        </>
    );
}

export default MyEditsTab;