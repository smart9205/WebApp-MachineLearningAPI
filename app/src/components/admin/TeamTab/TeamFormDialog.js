import React, { useState, useEffect, useReducer } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import GameService from '../../../services/game.service';
import Upload from '../../../common/upload';
import CircularProgress from '@mui/material/CircularProgress';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

const init = {
    id: 0,
    name: "",
    image: "",
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
                    dirName={process.env.REACT_APP_DIR_TEAM}
                    img={data.image}
                    onURL={url => setData({ image: url })}
                    defaultImg={TEAM_ICON_DEFAULT}
                />
                <Box style={{ minWidth: 300, margin: 10 }}>
                    <Input
                        fullWidth
                        sx={{ mt: 1 }}
                        placeholder='Team name'
                        value={data.name}
                        onChange={(e) => setData({ name: e.target.value })}
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