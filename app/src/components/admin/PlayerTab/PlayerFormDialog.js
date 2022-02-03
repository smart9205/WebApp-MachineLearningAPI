import React, { useState, useEffect, useReducer } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import GameService from '../../../services/game.service';
import Upload from '../../../common/upload';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

const init = {
    id: 0,
    f_name: "",
    l_name: "",
    date_of_birth: new Date(),
    position: null,
    jersey_number: 1,
    image: "",
}

export default function PlayerFormDialog({ open, onResult, edit = null }) {
    const [positionList, setPositionList] = useState([]);

    const [playerData, setPlayerData] = useReducer((old, action) => ({ ...old, ...action }), init)

    const [error, setError] = useReducer((old, action) => ({ ...old, ...action }), {
        f_name: false,
        l_name: false,
        position: false,
        jersey_number: false
    });

    useEffect(() => {
        GameService.getAllPositions().then(res => {
            setPositionList(res)
        })
    }, [])

    useEffect(() => {
        if (!edit) return
        setPlayerData({
            id: edit?.id,
            f_name: edit?.f_name,
            l_name: edit?.l_name,
            date_of_birth: edit?.date_of_birth,
            position: positionList.find(p => p.id === edit?.position),
            jersey_number: edit?.jersey_number,
            image: edit?.image,
        })
    }, [edit, positionList])

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

    const handlePlayerClose = (result) => {

        if (result) {
            if (!edit) {
                GameService.addPlayer({ ...playerData, position: playerData.position.id }).then((res) => {
                    if (res.status === "success") {
                        const msg = `${res.data.f_name} ${res.data.l_name} is successfully added!`
                        onResult({ open: false, msg, result: "success", data: res.data });
                    } else {
                        onResult({ open: false, msg: res.data, result: "error" });
                    }
                }).catch((e) => console.log("PLAYER ERROR", e));
            }
            else {
                GameService.updatePlayer({ ...playerData, position: playerData.position.id }).then((res) => {
                    onResult({ open: false, msg: res, result: "success" });
                }).catch((e) => { onResult({ open: false }); console.log("PLAYER ERROR", e) });
            }
        }
        setPlayerData(init)
        onResult({ open: false });
    };

    return (
        <Dialog open={open} onClose={e => handlePlayerClose(false)} maxWidth="lg">
            <DialogTitle>{!edit ? "Add New " : "Edit "}Player</DialogTitle>
            <DialogContent style={{ display: "flex" }}>
                <Upload
                    dirName={process.env.REACT_APP_DIR_PLAYER}
                    img={playerData.image}
                    onURL={url => setPlayerData({ image: url })}
                    fimeName={""}
                    defaultImg={PLAYER_ICON_DEFAULT}
                />
                <div>
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
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handlePlayerClose(false)}>Cancel</Button>
                <Button onClick={e => checkErrorPlayer() && handlePlayerClose(true)}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}