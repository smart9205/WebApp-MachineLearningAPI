import React, { useState, useReducer } from "react";

import {
    Paper,
    Box,
    IconButton,
    Button,
} from '@mui/material'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import TeamTagTable from '../TeamTagTable';
import VideoPlayer from '../VideoPlayer';
import CreateEditDialog from "./createEditDialog";
const MyEditsTab = ({ teamList, game, playerList }) => {
    const [open, setOpen] = useState(false)
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

    const handleOpen = (flag) => {
        setOpen(flag)
    }

    return (
        <>
            <CreateEditDialog
                open={open}
                handleOpen={handleOpen}
                teamList={teamList}
            />
            <Box
                style={{ minWidth: 310, overflowY: "scroll", fontSize: 12, display: showAccordion ? "" : "none" }}>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ color: 'black', margin: '0.5rem 1rem' }}>My Edits</h5>
                    <Button variant="outlined" onClick={() => handleOpen(true)}>New Edits</Button>
                </Box>
            </Box>
            <IconButton
                onClick={() => setShowAccordion((v) => !v)}
                sx={{ background: '#8080804d', zIndex: 10, position: "absolute", left: showAccordion ? 310 : 10 }}>
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