import React, { useState, useEffect, useReducer } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Grid, TextField, Paper, Box, IconButton, Autocomplete, CircularProgress } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service'
import TeamTagTable from './TeamTagTable';
import IndividualTagTable from './IndividualTagTable';
import TeamAccordion from './TeamAccordion';
import VideoPlayer from './VideoPlayer';

const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};
export default function Coach() {

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamList: [],
        team: null,

        gameList: [],
        game: null,
        teamTagList: [],
        actionTagList: [],
        allTagList: [],
        playerList: [],
    })
    const { teamList, team, gameList, game, teamTagList, actionTagList, allTagList, playerList } = state

    const [drawOpen, setDrawOpen] = useState(true)
    const [showAccordion, setShowAccordion] = useState(false)
    const [loading, setLoading] = useState(true)
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0)
    const [videoData, setVideodata] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        type: "TeamTag",
        autoPlay: true,
        tagList: [],
        videoPlay: false,
    })

    useEffect(() => {
        setLoading(true)
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] })
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        if (!team) return
        setLoading(true)
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] })
            setDrawOpen(true)
            setLoading(false)
        })
    }, [team])
    useEffect(() => {
        if (!!team && !!game) {
            setLoading(true)
            gameService.getAllPlayerTagsByTeam(team.team_id, game?.id).then((res) => {
                setState({ allTagList: res })
                setLoading(false)
            })
            gameService.getGameTeamPlayersByTeam(team.team_id, game?.id).then((res) => {
                setState({ playerList: res })
            })
        } else {
            setState({ allTagList: [] })
        }
    }, [team, game])

    if (loading)
        return (
            <div style={styles.loader}>
                <CircularProgress />
            </div>
        )
    else return (
        <>
            <Box sx={{ mx: 1, mt: 1, display: drawOpen ? "" : "none" }} >
                <Autocomplete
                    options={teamList}
                    value={team}
                    isOptionEqualToValue={(option, value) => option && option.team_name}
                    disableClearable
                    getOptionLabel={(t) => `${t.season_name} - ${t.league_name} - ${t.team_name}`}
                    renderInput={(params) => (
                        <TextField {...params} label="My Team" />
                    )}
                    onChange={(event, newValue) => {
                        setState({ team: newValue });
                    }}
                />
            </Box>
            <Paper sx={{ m: 1 }}>
                <Box sx={{ px: 1, display: drawOpen ? "flex" : "none", minHeight: 50, maxHeight: 350, overflowY: 'auto' }}>
                    {gameList.length === 0 ?
                        <Box sx={{
                            width: "100%", height: "100%", display: "flex",
                            justifyContent: "center", alignItems: "center"
                        }}>No Game</Box> :
                        <Grid container spacing={2} >
                            {gameList.map((g) => (
                                <Grid item xs={6} md={3} key={g.id} >
                                    <div
                                        style={game !== g ? { opacity: 0.5 } : {}}
                                        onClick={() => { setState({ game: g }) }}
                                    >
                                        <div
                                            className='gameImage'
                                            style={{ backgroundImage: `url(${g?.image?.length > 0 ? g.image : VIDEO_ICON})`, width: 100, height: 70 }}>
                                        </div>
                                        <div>
                                            <div>{moment(g.date).format('DD MMM, YYYY hh:mm')}</div>
                                            <div>{g.home_team_name}</div>
                                            <div>{g.away_team_name}</div>
                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    }
                </Box>
                <Box sx={{ textAlign: "center", borderTop: "1px #80808038 solid", m: '0 10px' }}>
                    <IconButton onClick={() => setDrawOpen((v) => !v)} sx={{ background: '#8080804d' }}>
                        {
                            drawOpen ?
                                <ArrowDropUpIcon /> :
                                <ArrowDropDownIcon />
                        }
                    </IconButton>
                </Box>
            </Paper>

            <Box style={{
                display: "flex", height: `calc(95vh - ${drawOpen ? gameList?.length === 0 ? 150 : gameList?.length / 4 * 50 + 170 : 100}px)`
            }}>
                <TeamAccordion
                    style={{ minWidth: 300, overflowY: "scroll", display: showAccordion ? "" : "none" }}
                    tagList={allTagList}
                    playTags={(res) => { }}
                    onActionSelected={(res) => {
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
                <IconButton onClick={() => setShowAccordion((v) => !v)} sx={{ background: '#8080804d', position: "absolute", left: showAccordion ? 310 : 10 }}>
                    {
                        showAccordion ?
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
                                type: "TeamTag",
                                tagList: teamTagList,
                                autoPlay: true,
                                videoPlay: false,
                            })
                            console.log("handleRowClick", idx)
                        }
                        }
                        selected={curTeamTagIdx}
                        onPlay={({ row, idx }) => {
                            console.log("onplay", row, idx)
                            setCurTeamTagIdx(idx)
                            setVideodata({
                                idx,
                                type: "TeamTag",
                                tagList: teamTagList,
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
                                type: "PlayerTag",
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
            </Box>
        </>
    )
}