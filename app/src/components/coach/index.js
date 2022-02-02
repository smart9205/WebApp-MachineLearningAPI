import React, { useState, useEffect, useReducer } from 'react'
import moment from 'moment'
import { Grid, TextField, Paper, Box, IconButton, Autocomplete, CircularProgress } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service'
import TeamTagTable from '../tagging/TeamTagTable';
import IndividualTagTable from '../tagging/IndividualTagTable';
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
        playerTagList: [],
        allTagList: [],
        curTeamTagId: 0
    })
    const { teamList, team, gameList, game, teamTagList, playerTagList, allTagList, curTeamTagId } = state

    const [drawOpen, setDrawOpen] = useState(true)
    const [loading, setLoading] = useState(true)
    const [filterTeamTags, setFilterTeamTags] = useState([])
    const [filteredTeamTagList, setFilteredTeamTagList] = useState([])

    const [videoData, setVideodata] = useReducer((old, action) => ({ ...old, ...action }), {
        start_time: "00:00:00",
        autoPlay: true,
        tagList: []
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
                console.log("res", res)
                setState({ allTagList: res })
                setLoading(false)
            })
        } else {
            setState({ allTagList: [] })
        }
    }, [team, game])
    useEffect(() => {
        const filtered = teamTagList.filter(f => filterTeamTags.includes(f.id))
        setFilteredTeamTagList(filtered)
        setState({ curTeamTagId: filtered[0]?.id });
    }, [filterTeamTags, teamTagList])

    const dispTeamTags = () => {
        if (!!game) {
            gameService.getAllTeamTagsByGame(game?.id).then(res => {
                setState({ teamTagList: res })
                if (!res.length) {
                    setState({ playerTagList: [] })
                    return
                }
                dispPlayerTags(res[0].id)
            })
        } else {
            setState({ teamTagList: [], playerTagList: [] })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { dispTeamTags() }, [game])

    const dispPlayerTags = (id) => {
        if (!id) {
            setState({ playerTagList: [] });
            return
        }
        gameService.getAllPlayerTagsByTeamTag(id).then(res => {
            setState({ playerTagList: res });
        }).catch(() => { })
    }

    if (loading)
        return (
            <div style={styles.loader}>
                <CircularProgress />
            </div>
        )
    else return (
        <>
            <Box sx={{ mx: 1, mt: 1 }} >
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
                    style={{ minWidth: 350, overflowY: "scroll" }}
                    tagList={allTagList}
                    playTags={(res) => { }}
                    onActionSelected={(res) => { setFilterTeamTags(res.map(t => t.team_tag_id)) }}
                />
                <Paper style={{ height: "100%", minWidth: 500 }}>
                    <TeamTagTable
                        sx={{ height: "60%", p: 1, width: "100%" }}
                        rows={filteredTeamTagList}
                        updateTagList={() => dispTeamTags()}
                        handleRowClick={row => { dispPlayerTags(row?.id); setState({ curTeamTagId: row?.id }) }}
                        selectedId={curTeamTagId}
                        del={false}
                        onPlay={(row) => setVideodata({
                            start_time: row.start_time,
                            autoPlay: true,
                            tagList: filteredTeamTagList,
                        })}
                    />
                    <IndividualTagTable
                        sx={{ height: "40%", p: 1, width: "100%" }}
                        rows={playerTagList}
                        offenseTeamId={team?.id}
                        offenseTeam={team}
                        updateTagList={() => dispPlayerTags(curTeamTagId)}
                        del={false}
                        onPlay={(row) => setVideodata({
                            start_time: row.start_time,
                            autoPlay: false,
                            tagList: [row],
                        })}
                    />
                </Paper>
                <VideoPlayer
                    videoData={videoData}
                    url={game?.video_url ?? ""}
                    onChangeClip={(id) => setState({ curTeamTagId: id })}
                />
            </Box>
        </>
    )
}