import React, { useEffect, useReducer } from 'react'
import moment from 'moment'
import { Grid, TextField, Paper, Box } from '@mui/material'
import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service'
import ObjectAutocomplete from '../custom/ObjectAutocomplete'
import TeamTagTable from '../tagging/TeamTagTable';
import IndividualTagTable from '../tagging/IndividualTagTable';

export default function Coach() {

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        seasonList: [],
        leagueList: [],
        teamList: [],
        season: null,
        league: null,
        team: null,
        search: "",

        gameList: [],
        game: null,
        teamTagList: [],
        playerTagList: [],
        teamTagId: 0,
    })
    const { seasonList, leagueList, teamList, season, league, team, search, gameList, game, teamTagList, playerTagList, teamTagId } = state
    useEffect(() => {
        gameService.getAllSeasons().then((res) => setState({ seasonList: res, season: res[0] }))
        gameService.getAllLeagues().then((res) => setState({ leagueList: res, league: res[0] }))
        gameService.getAllTeams().then((res) => setState({ teamList: res, team: res[0] }))
    }, [])

    useEffect(() => {
        if (season === null || league === null || team === null) return
        gameService.getAllGamesByTeam(season.id, league.id, team.id).then((res) => {
            setState({ gameList: res, game: res[0] })
            console.log("gameList", res)
        })
    }, [season, league, team])

    const dispTeamTags = () => {
        if (!game) return
        gameService.getAllTeamTagsByGame(game?.id).then(res => {
            setState({ teamTagList: res, teamTagId: res[0]?.id })
            if (!res.length) {
                setState({ playerTagList: [] })
                return
            }
            dispPlayerTags(res[0].id)
        })
    }

    useEffect(() => { dispTeamTags() }, [game])


    const dispPlayerTags = (id) => {
        if (!id) return
        setState({ teamTagId: id })

        gameService.getAllPlayerTagsByTeamTag(id).then(res => {
            setState({ playerTagList: res });
        }).catch(() => { })
    }

    return (
        <>
            <Grid container spacing={2} sx={{ px: 1 }}>
                <Grid item xs={6} md={3}>
                    <ObjectAutocomplete
                        label="Season"
                        value={season}
                        list={seasonList}
                        onResult={res => setState({ season: res })} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <ObjectAutocomplete
                        label="League"
                        value={league}
                        list={leagueList}
                        onResult={res => setState({ league: res })} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <ObjectAutocomplete
                        label="Team"
                        value={team}
                        list={teamList}
                        onResult={res => setState({ team: res })} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        label="Search"
                        fullWidth
                        sx={{ my: 1 }}
                        value={search}
                        onChange={(e) => setState({ search: e.target.value })} />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ px: 1 }}>
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
            <Box style={{ display: "flex", height: "80vh" }}>
                <Paper style={{ height: "100%" }}>
                    <TeamTagTable
                        sx={{ height: "60%", p: 1, width: "100%" }}
                        rows={teamTagList}
                        updateTagList={() => dispTeamTags()}
                        handleRowClick={row => dispPlayerTags(row?.id)}
                        selectedId={state.curTeamTagId}
                    />
                    <IndividualTagTable
                        sx={{ height: "40%", p: 1, width: "100%" }}
                        rows={playerTagList}
                        offenseTeamId={team?.id}
                        offenseTeam={team}
                        updateTagList={() => dispPlayerTags(state.curTeamTagId)}
                    />
                </Paper>
            </Box>
        </>
    )
}