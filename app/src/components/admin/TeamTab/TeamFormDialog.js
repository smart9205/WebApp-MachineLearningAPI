import React, { useState, useEffect, useReducer } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import GameService from '../../../services/game.service';
import Upload from '../../../common/upload';
import CircularProgress from '@mui/material/CircularProgress';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { ColorPicker } from 'material-ui-color';
import UploadSponsor from '../../../common/uploadSponsor';
import lang from '../../../assets/lang.json';

const init = {
    id: 0,
    name: '',
    image: '',
    team_color: '',
    second_color: '',
    sponsor_logo: '',
    sponsor_url: '',
    show_sponsor: false,
    create_highlights: false,
    team_language: 'en',
    filter_by_position: false
};

const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};
export default function TeamFormDialog({ open, onResult, edit = null, t }) {
    const [data, setData] = useReducer((old, action) => ({ ...old, ...action }), init);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!edit) return;
        setData({
            id: edit?.id,
            name: edit?.name,
            image: edit?.image,
            team_color: edit?.team_color,
            second_color: edit?.second_color,
            sponsor_logo: edit?.sponsor_logo,
            sponsor_url: edit?.sponsor_url,
            create_highlights: edit?.create_highlights,
            show_sponsor: edit?.show_sponsor,
            team_language: edit?.team_language ? edit.team_language : 'en',
            filter_by_position: edit?.filter_by_position
        });
    }, [edit]);

    const handleClose = (result) => {
        setLoading(true);

        if (result) {
            if (!edit) {
                GameService.addTeam(data)
                    .then((res) => {
                        onResult(true);
                        setData(init);
                        setLoading(false);
                    })
                    .catch((e) => {
                        onResult(false);
                        setData(init);
                        setLoading(false);
                    });
            } else {
                GameService.updateTeam(data)
                    .then((res) => {
                        onResult(true);
                        setData(init);
                        setLoading(false);
                    })
                    .catch((e) => {
                        onResult(false);
                        setData(init);
                        setLoading(false);
                    });
            }
        }
    };

    return (
        <Dialog open={open} onClose={(e) => onResult(false)} maxWidth="lg">
            {loading && (
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            )}
            <DialogTitle>
                {!edit ? t('Add') : t('Edit')} {t('Team')}
            </DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
                <Upload dirName={process.env.REACT_APP_DIR_TEAM} img={data.image} onURL={(url) => setData({ image: url })} defaultImg={TEAM_ICON_DEFAULT} btn_name={`${t('Team')} ${t('Logo')}`} />

                <Box style={{ margin: 10 }}>
                    <TextField fullWidth sx={{ my: 2 }} label={`${t('Team')} ${t('Name')}`} value={data.name} onChange={(e) => setData({ name: e.target.value })} />
                    <FormControl fullWidth>
                        <InputLabel id="select-language">Team Language</InputLabel>
                        <Select labelId="select-language" id="select" value={data.team_language} label="Language" onChange={(e) => setData({ team_language: e.target.value })}>
                            {lang.map((item, index) => (
                                <MenuItem key={index} value={item.code}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {`${t('Team')} ${t('Color')}`}
                    <ColorPicker
                        defaultValue="transparent"
                        value={data.team_color}
                        onChange={(color) => setData({ team_color: '#' + color.hex })}
                        style={{ '& .ColorPicker-MuiInputBase-input': { color: 'white' } }}
                    />
                    {`${t('Second')} ${t('Color')}`}
                    <ColorPicker
                        defaultValue="transparent"
                        value={data.second_color}
                        onChange={(color) => setData({ second_color: '#' + color.hex })}
                        style={{ '& .ColorPicker-MuiInputBase-input': { color: 'white' } }}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={<Switch checked={data.create_highlights} onChange={() => setData({ create_highlights: !data.create_highlights })} inputProps={{ 'aria-label': 'controlled' }} />}
                        label={`${t('Create')} ${t('Highlights')}`}
                    />

                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={<Switch checked={data.filter_by_position} onChange={() => setData({ filter_by_position: !data.filter_by_position })} inputProps={{ 'aria-label': 'controlled' }} />}
                        label={`${t('Filter By Position')}`}
                    />
                </Box>
            </DialogContent>
            <DialogContent style={{ display: 'flex' }}>
                <UploadSponsor
                    dirName={process.env.REACT_APP_DIR_TEAM}
                    img={data.sponsor_logo}
                    onSponsorURL={(url) => {
                        setData({ sponsor_logo: url });
                    }}
                    defaultImg={TEAM_ICON_DEFAULT}
                    btn_name={`${t('Sponsor')} ${t('Logo')}`}
                />
                <Box style={{ margin: 10 }}>
                    <TextField
                        fullWidth
                        style={{ margin: 10 }}
                        sx={{ mt: 1 }}
                        label={`${t('Sponsor')} ${t('URL')}`}
                        value={data.sponsor_url}
                        onChange={(e) => setData({ sponsor_url: e.target.value })}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={<Switch checked={data.show_sponsor} onChange={() => setData({ show_sponsor: !data.show_sponsor })} inputProps={{ 'aria-label': 'controlled' }} />}
                        label={`${t('Show')} ${t('Sponsor')}`}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => onResult(false)}>{t('Cancel')}</Button>
                <Button onClick={(e) => handleClose(true)}>{t('Done')}</Button>
            </DialogActions>
        </Dialog>
    );
}
