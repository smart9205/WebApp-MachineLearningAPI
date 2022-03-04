import React, { useState, useReducer } from "react";

import _ from 'lodash'
import { Paper, Box, IconButton } from '@mui/material'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import TeamTagTable from '../TeamTagTable';
import ExcelButton from '../ExcelButton';
import IndividualTagTable from '../IndividualTagTable';
import TeamAccordion from '../TeamAccordion';
import VideoPlayer from '../VideoPlayer';
const GameTab = ({ allTagList, game, playerList }) => {
    const [showAccordion, setShowAccordion] = useState(true)
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0)
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamTagList: [],
        actionTagList: [],
    })
    const { teamTagList, actionTagList } = state

    const [videoData, setVideodata] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        autoPlay: true,
        tagList: [],
        videoPlay: false,
    })

    return (
        <>
            <Box
                style={{ minWidth: 310, overflowY: "scroll", fontSize: 12, display: showAccordion ? "" : "none" }}>
                <TeamAccordion
                    tagList={allTagList}
                    playTags={(res) => { }}
                    onActionSelected={(res) => {
                        console.log("actionselected")
                        const teamTags = _.uniqBy(res, 'team_tag_id')
                        setState({
                            actionTagList: res,
                            teamTagList: teamTags
                        })
                        setCurTeamTagIdx(0)
                        setVideodata({
                            idx: 0,
                            autoPlay: true,
                            tagList: teamTags.map(t => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                }
                            }),
                            videoPlay: false,
                        })
                    }}
                />
            </Box>
            <IconButton
                onClick={() => setShowAccordion((v) => !v)}
                sx={{ background: '#8080804d', zIndex: 10, position: "absolute", left: showAccordion ? 310 : 10 }}>
                {showAccordion ?
                    <ArrowLeftIcon /> :
                    <ArrowRightIcon />
                }
            </IconButton>
            <Paper style={{ height: "100%", minWidth: 500, position: 'relative' }} className="coach-tag-table">
                <ExcelButton
                    style={{ position: "absolute", right: 10 }}
                    team={allTagList}
                />
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
                <IndividualTagTable
                    sx={{ height: "30%", p: 1, width: "100%" }}
                    rows={actionTagList.filter(tag => tag.team_tag_id === teamTagList[curTeamTagIdx]?.team_tag_id)}
                    offenseTeam={playerList}
                    updateTagList={() => { }}
                    onPlay={(row) => {
                        console.log("play", row)
                        setVideodata({
                            idx: 0,
                            autoPlay: false,
                            tagList: [row],
                            videoPlay: true
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

export default GameTab;