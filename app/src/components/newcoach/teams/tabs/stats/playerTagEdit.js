import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../../../services/game.service';
import { MenuProps } from '../../../components/common';

import '../../../coach_style.css';

const courtAreaList = [
    { name: 'Defensive', id: 4 },
    { name: 'Defensive Middle', id: 3 },
    { name: 'Offensive Middle', id: 2 },
    { name: 'Offensive', id: 1 }
];

const TeamPlayerTagEditDialog = ({ open, onClose, player }) => {
    const [actionList, setActionList] = useState([]);
    const [actionTypeList, setActionTypeList] = useState([]);
    const [actionResultList, setActionResultList] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [values, setValues] = useState({
        player_name: null,
        action_name: null,
        action_type: null,
        action_result: null,
        court_area: null,
        inside_pain: false,
        start_time: '00:00:00',
        end_time: '00:00:00'
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const handleTagSave = () => {
        GameService.updatePlayerTagByManual({
            id: player.tag_id,
            player_id: values.player_name.player_id,
            action: values.action_name.id,
            action_type: values.action_type.id,
            action_result: values.action_result.id,
            court_area: values.court_area.id,
            inside: values.inside_pain,
            start: values.start_time,
            end: values.end_time
        }).then((res) => {
            onClose(true);
        });
    };

    useEffect(async () => {
        if (!player) return;

        let players = [];
        let actions = [];
        let types = [];
        let results = [];

        await GameService.getAllActions().then((res) => {
            setActionList(res);
            actions = res;
        });
        await GameService.getAllActionTypes().then((res) => {
            setActionTypeList(res);
            types = res;
        });
        await GameService.getAllActionResults().then((res) => {
            setActionResultList(res);
            results = res;
        });
        await GameService.getGameTeamPlayersByTeam(player.team_id, player.game_id).then((res) => {
            setPlayerList(res);
            players = res;
        });

        if (player) {
            setValues({
                ...values,
                player_name: players.filter((p) => p.name === player.player_name)[0],
                court_area: courtAreaList.filter((c) => c.id === player.court_area)[0],
                action_name: actions.filter((item) => item.name === player.action_name)[0],
                action_type: types.filter((item) => item.name === player.action_type)[0],
                action_result: results.filter((item) => item.name === player.action_result)[0],
                inside_pain: player.inside_pain,
                start_time: player.start_time,
                end_time: player.end_time
            });
        }
    }, [player]);

    console.log('eeedit => ', player);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <DialogTitle>Player Tag Edit</DialogTitle>
            <DialogContent dividers style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                        <p className="normal-text" style={{ paddingLeft: '12px' }}>
                            Players
                        </p>
                        <Select
                            value={values.player_name}
                            onChange={handleChange('player_name')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            {playerList.map((item) => (
                                <MenuItem key={item.player_id} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <p className="normal-text" style={{ paddingLeft: '12px' }}>
                            Court Areas
                        </p>
                        <Select
                            value={values.court_area}
                            onChange={handleChange('court_area')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            {courtAreaList.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <FormControlLabel control={<Switch checked={values.inside_pain} onChange={(e) => setValues({ ...values, inside_pain: e.target.checked })} />} label="In the box" sx={{ mt: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                        <p className="normal-text" style={{ paddingLeft: '12px' }}>
                            Actions
                        </p>
                        <Select
                            value={values.action_name}
                            onChange={handleChange('action_name')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            {actionList.map((item) => (
                                <MenuItem key={item.id} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <p className="normal-text" style={{ paddingLeft: '12px' }}>
                            Action Types
                        </p>
                        <Select
                            value={values.action_type}
                            onChange={handleChange('action_type')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            {actionTypeList.map((item) => (
                                <MenuItem key={item.id} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <p className="normal-text" style={{ paddingLeft: '12px' }}>
                            Action Results
                        </p>
                        <Select
                            value={values.action_result}
                            onChange={handleChange('action_result')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            {actionResultList.map((item) => (
                                <MenuItem key={item.id} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextField
                        value={values.start_time}
                        onChange={handleChange('start_time')}
                        placeholder="00:00:00"
                        label="Start Time"
                        variant="outlined"
                        sx={{ width: '300px', fontSize: '0.8rem', '& .MuiOutlinedInput-root': { borderRadius: '10px' }, '& .MuiOutlinedInput-input': { padding: '0 12px', height: '36px' } }}
                    />
                    <TextField
                        value={values.end_time}
                        onChange={handleChange('end_time')}
                        placeholder="00:00:00"
                        label="End Time"
                        variant="outlined"
                        sx={{ width: '300px', fontSize: '0.8rem', '& .MuiOutlinedInput-root': { borderRadius: '10px' }, '& .MuiOutlinedInput-input': { padding: '0 12px', height: '36px' } }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => onClose(false)}>
                    Cancel
                </Button>
                <Button variant="outlined" onClick={() => handleTagSave()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamPlayerTagEditDialog;
