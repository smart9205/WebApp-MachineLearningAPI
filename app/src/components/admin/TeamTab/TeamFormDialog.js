import React, { useState, useEffect, useReducer } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import GameService from '../../../services/game.service';
import Upload from '../../../common/upload';
import CircularProgress from '@mui/material/CircularProgress';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { ColorPicker } from 'material-ui-color';
const init = {
    id: 0,
    name: "",
    image: "",
    team_color: "",
    sponsor_logo: "",
    sponsor_url: "",
    show_sponsor: false,
    create_highlights: false
}

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
export default function TeamFormDialog({ open, onResult, edit = null }) {

    const [data, setData] = useReducer((old, action) => ({ ...old, ...action }), init)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!edit) return
        setData({
            id: edit?.id,
            name: edit?.name,
            image: edit?.image,
            team_color: edit?.team_color,
            sponsor_logo: edit?.sponsor_logo,
            sponsor_url: edit?.sponsor_url,
            create_highlights: edit?.create_highlights,
            show_sponsor: edit?.show_sponsor
        })
    }, [edit])

    const handleClose = (result) => {
        setLoading(true)

        if (result) {
            if (!edit) {
                GameService.addTeam(data).then((res) => {
                    onResult(true)
                    setData(init)
                    setLoading(false)
                }).catch((e) => { onResult(false); setData(init); setLoading(false) });
            }
            else {
                GameService.updateTeam(data).then((res) => {
                    onResult(true)
                    setData(init)
                    setLoading(false)
                }).catch((e) => { onResult(false); setData(init); setLoading(false) });
            }
        }
    };

    return (
        <Dialog open={open} onClose={e => onResult(false)} maxWidth="lg">
            {loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
            <DialogTitle>{!edit ? "Add" : "Edit"} Team</DialogTitle>
            <DialogContent style={{ display: "flex" }}>
                <Upload
                    className="team-logo"
                    dirName={process.env.REACT_APP_DIR_TEAM}
                    img={data.image}
                    onURL={url => setData({ image: url })}
                    defaultImg={TEAM_ICON_DEFAULT}
                    btn_name="Team Logo"
                />

                <Box style={{ margin: 10 }}>
                    <TextField
                        fullWidth
                        sx={{ my: 2 }}
                        label='Team name'
                        value={data.name}
                        onChange={(e) => setData({ name: e.target.value })}
                    />
                    Team Color
                    <ColorPicker
                        defaultValue="transparent"
                        value={data.team_color}
                        onChange={(color) => setData({ team_color: color.value })}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Checkbox
                                checked={data.create_highlights}
                                onChange={() => setData({ create_highlights: !data.create_highlights })}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Create Highlights"
                    />
                </Box>
            </DialogContent>
            <DialogContent style={{ display: "flex" }}>

                <Upload
                    className="sponsor-logo"
                    dirName={process.env.REACT_APP_DIR_TEAM}
                    img={data.sponsor_logo}
                    onURL={url => setData({ sponsor_logo: url })}
                    defaultImg={TEAM_ICON_DEFAULT}
                    btn_name="Sponsor Logo"
                />
                <Box style={{ margin: 10 }}>

                    <TextField
                        fullWidth
                        style={{ margin: 10 }}
                        sx={{ mt: 1 }}
                        label='Sponsor URL'
                        value={data.sponsor_url}
                        onChange={(e) => setData({ sponsor_url: e.target.value })}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Checkbox
                                checked={data.show_sponsor}
                                onChange={() => setData({ show_sponsor: !data.show_sponsor })}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Show Sponsor"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => onResult(false)}>Cancel</Button>
                <Button onClick={e => handleClose(true)}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}