import React, { useState, useEffect, useReducer } from 'react'
import { useSelector } from "react-redux";
import moment from 'moment'
import { Grid, TextField, Paper, Box, IconButton, Autocomplete, CircularProgress, Button } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service'

import { makeStyles } from '@mui/styles';

import GameTab from './Tabs/gameTab';
import MyEditsTab from './Tabs/myEditsTab';
import TeamStatsTab from './Tabs/TeamStatsTab';
import PlayerStatsTab from './Tabs/PlayerStatsTab';

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

const useStyles = makeStyles((theme) => ({
    '@global': {
        p: {
            color: "black"
        }
    },
}));

export default function Coach() {
    const classes = useStyles();

    const { user: currentUser } = useSelector((state) => state.auth);

    // const [curTab, setCurTab] = useState(!currentUser?.create_edits ? 0 : 3)
    const [curTab, setCurTab] = useState(1)

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamList: [],
        team: null,
        playerList: [],

        gameList: [],
        game: null,
        allTagList: [],
        opponentTagList: []
    })
    const { teamList, team, gameList, game, allTagList, playerList, opponentTagList } = state

    const [drawOpen, setDrawOpen] = useState(true)

    const [loading, setLoading] = useState(true)


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
        console.log("game", game)
        if (!!team && !!game) {
            setLoading(true)
            const opponentTeamId = game?.away_team_id === team.team_id ? game?.home_team_id : game?.away_team_id
            gameService.getAllPlayerTagsByTeam(team.team_id, game?.id).then((res) => {
                setState({ allTagList: res })
                setLoading(false)
            })
            gameService.getAllPlayerTagsByTeam(opponentTeamId, game?.id).then((res) => {
                setState({ opponentTagList: res })
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
        <Box classes={classes['@global']} style={{ background: "white", padding: "8px 8px 0" }}>
            <Grid container spacing={2} >
                <Grid item xs={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {["Games", "Team Stats", "Player Stats", "My Edits"].map((title, idx) =>
                        !(idx === 3 && !currentUser?.create_edits) &&
                        <Button
                            fullWidth
                            key={idx}
                            style={{ height: "50px" }}
                            variant={curTab === idx ? "contained" : "outlined"}
                            onClick={() => setCurTab(idx)}
                        >
                            {title}
                        </Button>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {curTab !== 3 && <Autocomplete
                        options={teamList}
                        value={team}
                        fullWidth
                        isOptionEqualToValue={(option, value) => option && option.team_name}
                        disableClearable
                        getOptionLabel={(t) => `${t.season_name} - ${t.league_name} - ${t.team_name}`}
                        renderInput={(params) => (
                            <TextField {...params} label="My Team" />
                        )}
                        onChange={(event, newValue) => {
                            setState({ team: newValue });
                        }}
                    />}
                </Grid>
            </Grid>
            {curTab === 0 &&
                <Paper sx={{ m: 1 }}>
                    <Box sx={{ px: 1, display: drawOpen ? "flex" : "none", minHeight: 50, maxHeight: 350, overflowY: 'auto' }}>
                        {gameList.length === 0 ?
                            <Box sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>No Game</Box> :
                            <Grid container spacing={2} >
                                {gameList.map((g) => (
                                    <Grid item xs={6} md={2} key={g.id} >
                                        <Paper
                                            sx={{ m: 1 }}
                                            style={game !== g ? { opacity: 0.5 } : {}}
                                            onClick={() => { setState({ game: g }) }}
                                        >
                                            <div
                                                className='gameImage'
                                                style={{ backgroundImage: `url(${g?.image?.length > 0 ? g.image : VIDEO_ICON})`, width: 100, height: 70 }}>
                                            </div>
                                            <div>
                                                <div>{moment(g.date).format('DD MMM, YYYY')}</div>
                                                <div>{g.home_team_name}</div>
                                                <div>{g.away_team_name}</div>
                                            </div>
                                        </Paper>
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
            }

            <Paper className='coach-down-side'
                style={{
                    paddingBottom: "0.5rem",
                    display: "flex",
                    height: curTab === 0 ? `calc(95vh - ${drawOpen ? gameList?.length === 0 ? 230 : gameList?.length / 4 * 50 + 250 : 180}px)` :
                        curTab === 3 ? `calc(95vh - ${drawOpen ? gameList?.length === 0 ? 100 : gameList?.length / 4 * 50 + 120 : 50}px)` : ''
                }}>
                {curTab === 0 &&
                    <GameTab
                        allTagList={allTagList}
                        game={game}
                        playerList={playerList}
                        teamId={team?.team_id}
                        opponentTagList={opponentTagList}
                    />}
                {curTab === 1 && <TeamStatsTab gameList={gameList} team={team} />}
                {curTab === 2 && <PlayerStatsTab />}
                {curTab === 3 && <MyEditsTab teamList={teamList} game={game} playerList={playerList} />}
            </Paper>
        </Box>
    )
}

