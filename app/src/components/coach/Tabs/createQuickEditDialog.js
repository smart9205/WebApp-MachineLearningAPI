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


const CreateQuickEditDialog = ({ open, handleQuickEditOpen, teamList, t }) => {

    const theme = useTheme();

    const [loading, setLoading] = useState(false)
    const [nameOpen, setNameOpen] = useState(false)
    const [name, setName] = useState("")
    const [game, setGame] = useState([])
    const [curSelect, setCurSelect] = useState(0)
    const [action, setAction] = useState([])
    const [actionType, setActionType] = useState([])
    const [actionResult, setActionResult] = useState([])

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        actionList: [],
        actionTypeList: [],
        actionResultList: [],
        gameList: [],

        team: teamList[0] ?? null,

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

    const handleChangeGame = (event) => {
        const { target: { value } } = event;
        setGame(value);
    };

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
            </Dialog >

            <Dialog
                fullWidth
                maxWidth={"lg"}
                open={open}
                onClose={() => handleQuickEditOpen(false)}
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
                            <Autocomplete
                                options={gameList}
                                value={game}
                                fullWidth
                                isOptionEqualToValue={(option, value) => option && `${moment(option.date).format('DD MMM, YYYY')} - ${option.season_name} - ${option.league_name} - ${option.home_team_name} VS ${option.away_team_name}`}
                                disableClearable
                                getOptionLabel={(t) => `${moment(t.date).format('DD MMM, YYYY')} - ${t.season_name} - ${t.league_name} - ${t.home_team_name} VS ${t.away_team_name}`}
                                renderInput={(params) => (
                                    <TextField {...params} label={t("Game")} />
                                )}
                                onChange={(event, newValue) => {
                                    handleChangeGame(event)
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleQuickEditOpen(false)}>{t("Close")}</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}

export default CreateQuickEditDialog;