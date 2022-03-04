import React, { useState, useReducer, useEffect } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Autocomplete,
    Grid
} from '@mui/material'
import moment from 'moment'
import gameService from "../../../services/game.service";

const CreateEditDialog = ({ open, handleOpen, teamList, playerList }) => {
    const [curSelect, setCurSelect] = useState(0)
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        actionList: [],
        actionTypeList: [],
        actionResultList: [],

        action: 0,
        actionType: 0,
        actionResult: 0,

        team: teamList[0] ?? null,
        gameList: [],
        game: null,

        player: playerList[0] ?? null,
    })
    const { actionList, actionTypeList, actionResultList, action, actionType, actionResult, team, gameList, game, player } = state

    useEffect(() => {
        gameService.getAllActions().then(res => setState({ actionList: res, action: res[0] ?? null }))
        gameService.getAllActionTypes().then(res => setState({ actionTypeList: res, actionType: res[0] ?? null }))
        gameService.getAllActionResults().then(res => setState({ actionResultList: res, actionResult: res[0] }))
    }, [])

    useEffect(() => {
        if (!team) return
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] ?? null })
        })
    }, [team])

    const handleChangeAction = (e) => {
        setState({ action: e.target.value })
    }

    const handleChangeActionType = (e) => {
        setState({ actionType: e.target.value })
    }

    const handleChangeActionResult = (e) => {
        setState({ actionResult: e.target.value })
    }

    const handleSearch = () => {
        console.log("handle search")
    }

    console.log("playerlist", gameList)

    return (
        <Dialog
            fullWidth
            maxWidth={"lg"}
            open={open}
            onClose={() => handleOpen(false)}
        >
            <DialogTitle>Create Edits</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={teamList}
                            value={team}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option && option.team_name}
                            disableClearable
                            getOptionLabel={(t) => `${t.team_name}`}
                            renderInput={(params) => (
                                <TextField {...params} label="My Team" />
                            )}
                            onChange={(event, newValue) => {
                                setState({ team: newValue });
                            }}
                        />
                    </Grid>
                    <Grid item xs={8} >
                        <Autocomplete
                            options={gameList}
                            value={game}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option && option.team_name}
                            disableClearable
                            getOptionLabel={(t) =>
                                `${t.season_name} - ${t.league_name} - ${t.home_team_name} VS ${t.away_team_name} - ${moment(t.date).format('DD MMM, YYYY')}`}
                            renderInput={(params) => (
                                <TextField {...params} label="Game" />
                            )}
                            onChange={(event, newValue) => {
                                setState({ game: newValue });
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ my: 2 }}>
                    {["Defense", "Offense"].map((label, idx) =>
                        <Grid item xs={4} key={idx}>
                            <Button
                                key={idx}
                                variant={idx === curSelect ? "contained" : "outlined"}
                                onClick={() => setCurSelect(idx)}
                                sx={{ m: 1 }}
                            >
                                {label}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={4}>
                        <Autocomplete
                            options={playerList}
                            value={player}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option && option.name}
                            disableClearable
                            getOptionLabel={(t) => `${t.name}`}
                            renderInput={(params) => (
                                <TextField {...params} label="Individual" />
                            )}
                            onChange={(event, newValue) => {
                                setState({ player: newValue });
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action</InputLabel>
                        <Select
                            labelId="action-select-label"
                            id="action-select"
                            value={action}
                            label="Action"
                            fullWidth
                            onChange={handleChangeAction}
                        >
                            {actionList.map((action, idx) =>
                                <MenuItem key={idx} value={action}>{action?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action Types</InputLabel>

                        <Select
                            labelId="action-select-label"
                            id="action-select"
                            value={actionType}
                            label="Action Type"
                            fullWidth
                            onChange={handleChangeActionType}
                        >
                            {actionTypeList.map((actionType, idx) =>
                                <MenuItem key={idx} value={actionType}>{actionType?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action Results</InputLabel>
                        <Select
                            labelId="action-result-select-label"
                            id="action-result-select"
                            value={actionResult}
                            label="Action Result"
                            fullWidth
                            onChange={handleChangeActionResult}
                        >
                            {actionResultList.map((actionResult, idx) =>
                                <MenuItem key={idx} value={actionResult}>{actionResult?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleOpen(false)}>Close</Button>
                <Button onClick={() => handleSearch()}>Search</Button>
            </DialogActions>
        </Dialog >

    );
}

export default CreateEditDialog;