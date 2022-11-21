import React, { useEffect, useReducer, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

const areas = [
    { id: 1, name: "Defensive" },
    { id: 2, name: "Defensive Middle" },
    { id: 3, name: "Offensive Middle" },
    { id: 4, name: "Offensive" },
]

const PlayerTagForm = ({ offenseTeam, defenseTeam, taggingState, setOpenModal, sendTimeData, setPlay, tagActionsList, tagActionTypesList, tagActionResultsList }) => {

    const [alertOpen, setAlertOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [handleDialog, setHandleDialog] = useState(true)
    const [allPlayerList, setAllPlayerList] = useState([])
    const [player, setPlayer] = useState('');
    const [teamId, setTeamId] = useState('');
    const [courtAreas, setCourtAreas] = useState('');
    const [inTheBox, setInTheBox] = useState(false);
    const [action, setAction] = useState('');
    const [actionType, setActionType] = useState('');
    const [actionResult, setActionResult] = useState('');
    const [timeData, setTimeData] = useReducer((old, action) => ({ ...old, ...action }), {
        start_time: '00:00:00',
        end_time: '00:00:00'
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const OpenAlert = (msg, type = 'success') => {
        setAlertOpen(true);
        setAlert(msg);
        setAlertType(type);
    };

    const timeFormat = (n) => {
        return n > 9 ? "" + n : "0" + n;
    }


    const handleSubmitForm = () => {

        if (!player || !courtAreas || !action || !actionType) {
            OpenAlert('Input enough data to add a new game!', 'warning');
            return;
        }

        const playerTag = {
            start_time: timeFormat(timeData.start_time.$H) + ":" + timeFormat(timeData.start_time.$m) + ":" + timeFormat(timeData.start_time.$s),
            end_time: timeFormat(timeData.end_time.$H) + ":" + timeFormat(timeData.end_time.$m) + ":" + timeFormat(timeData.end_time.$s)
        }

        sendTimeData(playerTag)

        taggingState([
            {
                action_type_id: actionType,
                team_id: teamId,
                player_id: player,
                action_id: action,
                action_result_id: actionResult,
                court_area_id: courtAreas,
                inside_the_paint: inTheBox
            }
        ]);

        setOpenModal(false)
        setPlay(true)
    }

    useEffect(() => {
        let mergeArray = [...defenseTeam, ...offenseTeam]
        setAllPlayerList(mergeArray)
    }, [])

    return (
        <Dialog open={handleDialog} onClose={(e) => setHandleDialog(false)} maxWidth="lg">
            <DialogTitle>{'Add Player'}</DialogTitle>
            <DialogContent style={{ display: "flex" }}>

                <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                        {alert}
                    </Alert>
                </Snackbar>

                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="simple-select-label">Players</InputLabel>
                                <Select
                                    labelId="simple-select-label"
                                    id="simple-select"
                                    value={player}
                                    label="Players"
                                    required
                                    onChange={(e) => setPlayer(e.target.value)}
                                >
                                    {
                                        allPlayerList ? allPlayerList.map((player, idx) => (
                                            <MenuItem key={idx} value={player.id} onClick={() => setTeamId(player.team_id)}>{`${player.f_name} ${player.l_name}`}</MenuItem>
                                        ))
                                            : <MenuItem value=''>No Pleyer</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={4} >
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="court-select-label">Court Areas</InputLabel>
                                <Select
                                    labelId="court-select-label"
                                    id="court-select"
                                    value={courtAreas}
                                    label="Court Areas"
                                    required
                                    onChange={(e) => setCourtAreas(e.target.value)}
                                >
                                    {
                                        areas ? areas.map((area, idx) => (
                                            <MenuItem key={idx} value={area.id}>{area.name}</MenuItem>
                                        ))
                                            : <MenuItem value=''>No Court Area</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={4} >
                        <FormGroup>
                            <FormControlLabel control={<Switch value={inTheBox} onChange={() => setInTheBox(!inTheBox)} />} label="In The Box" />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={4} sx={{ marginTop: 3 }} >
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="action-select-label">Actions</InputLabel>
                                <Select
                                    labelId="action-select-label"
                                    id="action-select"
                                    value={action}
                                    label="Actions"
                                    onChange={(e) => setAction(e.target.value)}
                                >
                                    {
                                        tagActionsList ? tagActionsList.map((action, idx) => (
                                            <MenuItem key={idx} value={action.id}>{action.name}</MenuItem>
                                        ))
                                            : <MenuItem value=''>No Action</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sx={{ marginTop: 3 }} >
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="action-select-label">Action Types</InputLabel>
                                <Select
                                    labelId="action-select-label"
                                    id="action-select"
                                    value={actionType}
                                    required
                                    label="Action Types"
                                    onChange={(e) => setActionType(e.target.value)}
                                >
                                    {
                                        tagActionTypesList ? tagActionTypesList.map((data, idx) => (
                                            <MenuItem key={idx} value={data.id}>{data.name}</MenuItem>
                                        ))
                                            : <></>
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sx={{ marginTop: 3 }} >
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl fullWidth>
                                <InputLabel id="action-select-label">Action Results</InputLabel>
                                <Select
                                    labelId="action-select-label"
                                    id="action-select"
                                    required
                                    value={actionResult}
                                    label="Action Results"
                                    onChange={(e) => setActionResult(e.target.value)}
                                >
                                    {
                                        tagActionResultsList ? tagActionResultsList.map((data, idx) => (
                                            <MenuItem key={idx} value={data.id}>{data.name}</MenuItem>
                                        ))
                                            : <></>
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={6} sx={{ marginTop: 3 }} >
                            <Box sx={{ minWidth: 180 }}>
                                <TimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={['hours', 'minutes', 'seconds']}
                                    inputFormat="HH:mm:ss"
                                    mask="__:__:__"
                                    label="Start Time"
                                    value={timeData.start_time}
                                    onChange={(newValue) => {
                                        setTimeData({ start_time: newValue });
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6} sx={{ marginTop: 3 }} >
                            <Box sx={{ minWidth: 180 }}>
                                <TimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={['hours', 'minutes', 'seconds']}
                                    inputFormat="HH:mm:ss"
                                    mask="__:__:__"
                                    label="End Time"
                                    value={timeData.end_time}
                                    onChange={(newValue) => {
                                        setTimeData({ end_time: newValue });
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Box>
                        </Grid>
                    </LocalizationProvider>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={e => {
                    setHandleDialog(false)
                    setOpenModal(false)
                }}>Cancel</Button>
                <Button onClick={e => handleSubmitForm(true)}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PlayerTagForm