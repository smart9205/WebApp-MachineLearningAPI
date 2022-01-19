import React, { useState, useEffect, useReducer } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import GameService from '../../../services/game.service';

export default function PlayerFormDialog({ open, onResult, init = null }) {
    const [positionList, setPositionList] = useState([]);

    const [playerData, setPlayerData] = useReducer((old, action) => ({ ...old, ...action }), {
        f_name: "",
        l_name: "",
        date_of_birth: new Date(),
        position: null,
        jersey_number: 1
    })

    const [error, setError] = useReducer((old, action) => ({ ...old, ...action }), {
        f_name: false,
        l_name: false,
        position: false,
        jersey_number: false
    });

    useEffect(() => {
        setError({
            f_name: playerData.f_name.length === 0,
            l_name: playerData.l_name.length === 0,
            position: !playerData.position,
            jersey_number: Number(playerData.jersey_number) <= 0
        })
    }, [playerData])

    const checkErrorPlayer = () => {
        return !(Object.keys(error).find(key => error[key]));
    }

    useEffect(() => {
        GameService.getAllPositions().then(res => {
            setPositionList(res)
        })
    }, [])

    const handlePlayerClose = (result) => {

        if (result) {
            GameService.addPlayer({ ...playerData, position: playerData.position.id }).then((res) => {
                if (res.status === "success") {
                    const msg = `${res.data.f_name} ${res.data.l_name} is successfully added!`
                    onResult({ data: false, msg, result: "success" });
                } else {
                    onResult({ data: false, msg: res.data, result: "error" });
                }
            });
        }

        onResult({ data: false });
    };

    return (
        <Dialog open={open} onClose={e => handlePlayerClose(false)}>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To add new Player, please TextField Player details
                </DialogContentText>
                <div style={{ display: 'flex' }}>
                    <TextField
                        autoFocus
                        sx={{ m: 0.8 }}
                        value={playerData.f_name}
                        onChange={e => setPlayerData({ f_name: e.target.value })}
                        helperText={error.f_name ? "First Name cannot be empty" : ""}
                        error={error.f_name}
                        label="First Name"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        sx={{ m: 0.8 }}
                        value={playerData.l_name}
                        onChange={e => setPlayerData({ l_name: e.target.value })}
                        helperText={error.l_name ? "Last Name cannot be empty" : ""}
                        error={error.l_name}
                        label="Last  Name"
                        fullWidth
                        variant="outlined"
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <Autocomplete
                        sx={{ m: 0.8 }}
                        id="combo-box-demo"
                        options={positionList}
                        fullWidth
                        value={playerData.position}
                        onChange={(event, newValue) => {
                            setPlayerData({ position: newValue })
                        }}
                        getOptionLabel={
                            (option) => !option?.name ? "" : option.name
                        }
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Position"
                                helperText={error.position ? "Position cannot be empty" : ""}
                                error={error.position}
                            />}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            label="Date of Birth"
                            value={playerData.date_of_birth}
                            onChange={v => setPlayerData({ date_of_birth: v })}
                            renderInput={(params) =>
                                <TextField
                                    sx={{ m: 0.8 }}
                                    {...params}
                                />
                            }
                        />
                    </LocalizationProvider>
                </div>
                <TextField
                    sx={{ m: 0.8 }}
                    label="Jercey Number"
                    type="number"
                    value={playerData.jersey_number}
                    onChange={e => setPlayerData({ jersey_number: e.target.value })}
                    helperText={error.jersey_number ? "Jersey Number cannot be less than 0" : ""}
                    error={error.jersey_number}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handlePlayerClose(false)}>Cancel</Button>
                <Button onClick={e => checkErrorPlayer() && handlePlayerClose(true)}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}