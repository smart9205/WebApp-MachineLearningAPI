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
    Grid,
    OutlinedInput,
    Chip,
    CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import moment from 'moment'
import gameService from "../../../services/game.service";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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

function getStyles(name, action, theme) {
    return {
        fontWeight:
            action.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const CreateEditDialog = ({ open, handleEditOpen, teamList, t }) => {

    const theme = useTheme();

    const [loading, setLoading] = useState(false)
    const [nameOpen, setNameOpen] = useState(false)
    const [name, setName] = useState("")
    const [curSelect, setCurSelect] = useState(0)

    const [game, setGame] = useState([])
    const [action, setAction] = useState([])
    const [actionType, setActionType] = useState([])
    const [actionResult, setActionResult] = useState([])

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        actionList: [],
        actionTypeList: [],
        actionResultList: [],

        team: teamList[0] ?? null,
        gameList: [],

        playerList: [],
        player: null,
    })
    const { actionList, actionTypeList, actionResultList, team, gameList, player, playerList } = state

    useEffect(() => {
        gameService.getAllActions().then(res => setState({ actionList: res }))
        gameService.getAllActionTypes().then(res => setState({ actionTypeList: res }))
        gameService.getAllActionResults().then(res => setState({ actionResultList: res }))
    }, [])

    useEffect(() => {
        if (!team) return
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] ?? null })
        })
        setGame([])
    }, [team])

    useEffect(() => {
        if (!open) return

        if (!!team && game.length > 0) {
            gameService.getGameTeamPlayersByTeam(team.team_id, game.map(g => g.id).join(",")).then((res) => {
                setState({ playerList: res })
            })
        }
        setAction([])
        setActionType([])
        setActionResult([])
        setState({ player: null })
    }, [team, game, open])

    useEffect(() => {
        setAction([])
        setActionType([])
        setActionResult([])
        if (curSelect !== 2)
            setState({ player: null })
    }, [curSelect])


    const handleSearch = () => {
        setNameOpen(true)
    }

    const handleChangeGame = (event) => {
        const { target: { value } } = event;
        if (value.length > 5) return;
        setGame(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeAction = (event) => {
        const { target: { value } } = event;
        setAction(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeActionType = (event) => {
        const { target: { value } } = event;
        setActionType(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeActionResult = (event) => {
        const { target: { value } } = event;
        setActionResult(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSave = () => {
        setLoading(true)
        gameService.addUserEdits({
            name,
            teamId: team?.team_id,
            gameIds: game.map(g => g.id),
            actionIds: action.map(a => a.id),
            actionTypeIds: actionType.map(a => a.id),
            actionResultIds: actionResult.map(a => a.id),
            curSelect, // 0: offense, 1: defense, 2: individual 
            playerId: player?.id,
        }).then(res => {
            setLoading(false)
            setNameOpen(false)
            handleEditOpen(false)
        })
    }

    return (
        <>
            {
                loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
            <Dialog
                fullWidth
                maxWidth={"sm"}
                open={nameOpen}
                onClose={() => setNameOpen(false)}
            >
                <DialogTitle>{t("Name")}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label={t("Name")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNameOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>OK</Button>
                </DialogActions>
            </Dialog >

            <Dialog
                fullWidth
                maxWidth={"lg"}
                open={open}
                onClose={() => handleEditOpen(false)}
            >
                <DialogTitle>{t("Create")} {t("NewEdit")}</DialogTitle>
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
                                    <TextField {...params} label={t("MyTeam")} />
                                )}
                                onChange={(event, newValue) => {
                                    setState({ team: newValue });
                                }}
                            />
                        </Grid>
                        <Grid item xs={8} >
                            <FormControl fullWidth>
                                <InputLabel id="select-multiple-game-label">{t("Games")}</InputLabel>
                                <Select
                                    labelId="select-multiple-game-label"
                                    id="select-multiple-game"
                                    multiple
                                    value={game}
                                    onChange={handleChangeGame}
                                    input={<OutlinedInput id="select-multiple-game" label={t("Games")} />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value, idx) => (
                                                <Chip key={idx} label={`${moment(value.date).format('DD MMM, YYYY')} - ${value.season_name} - ${value.league_name} - ${value.home_team_name} VS ${value.away_team_name}`} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {gameList.map((a, idx) =>
                                        <MenuItem key={idx} value={a} style={getStyles(a, game, theme)}>
                                            {`${moment(a.date).format('DD MMM, YYYY')} - ${a.season_name} - ${a.league_name} - ${a.home_team_name} VS ${a.away_team_name}`}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 2 }}>
                        {[t("Offense"), t("Defense")].map((label, idx) =>
                            <Grid item xs={4} key={idx}>
                                <Button
                                    key={idx}
                                    variant={idx === curSelect && !player ? "contained" : "outlined"}
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
                                    <TextField {...params} label={t("Individual")} />
                                )}
                                onChange={(event, newValue) => {
                                    setCurSelect(2);
                                    setState({ player: newValue });
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id="select-multiple-action-label">Actions</InputLabel>
                            <Select
                                labelId="select-multiple-action-label"
                                id="select-multiple-action"
                                multiple
                                value={action}
                                onChange={handleChangeAction}
                                input={<OutlinedInput id="select-multiple-action" label={t("Action")} />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value, idx) => (
                                            <Chip key={idx} label={value?.name} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {actionList.map((a, idx) =>
                                    <MenuItem key={idx} value={a} style={getStyles(a, action, theme)}>{a?.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="select-multiple-actiontype-label">Action Types</InputLabel>
                            <Select
                                labelId="select-multiple-actiontype-label"
                                id="select-multiple-actiontype"
                                multiple
                                value={actionType}
                                onChange={handleChangeActionType}
                                input={<OutlinedInput id="select-multiple-actiontype" label={t("ActionType")} />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value, idx) => (
                                            <Chip key={idx} label={value?.name} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {actionTypeList.map((a, idx) =>
                                    <MenuItem key={idx} value={a} style={getStyles(a, actionType, theme)}>{a?.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="select-multiple-action-label">Action Results</InputLabel>
                            <Select
                                labelId="select-multiple-action-label"
                                id="select-multiple-action"
                                multiple
                                value={actionResult}
                                onChange={handleChangeActionResult}
                                input={<OutlinedInput id="select-multiple-action" label={t("ActionResult")} />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value, idx) => (
                                            <Chip key={idx} label={value?.name} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {actionResultList.map((a, idx) =>
                                    <MenuItem key={idx} value={a} style={getStyles(a, actionResult, theme)}>{a?.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditOpen(false)}>{t("Close")}</Button>
                    <Button onClick={() => handleSearch()} disabled={!game.length || !team}>{t("Search")}</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}

export default CreateEditDialog;