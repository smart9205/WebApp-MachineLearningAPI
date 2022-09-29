import * as React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TextField, Autocomplete, IconButton, Snackbar, Alert } from '@mui/material';

import PlayerTable from './PlayerTable';
import GameService from '../../../services/game.service';

export default function SearchComponent({ selectedTeamCallBack, updatePlayerListCallBack, teamtype, season, league, teamList, playerList, defaultTeamId, t }) {
    const mounted = React.useRef(false);
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = React.useState('');
    const [alertType, setAlertType] = React.useState('success');

    const [selectedTeam, setSelectedTeam] = React.useState('');
    const [selectedPlayer, setSelectedPlayer] = React.useState('');
    const [teamPlayerList, setTeamPlayerList] = React.useState([]);

    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!teamList.length) return;
        // setSeason(seasonList.find(s => s.id === editData.season_id));
        const editTeam = teamList.find((s) => s.id === defaultTeamId);
        editTeam && setSelectedTeam(editTeam);
    }, [defaultTeamId, teamList]);

    React.useEffect(() => {
        try {
            if (!season.id || !league.id || !selectedTeam.id) return;
            GameService.getAllTeamPlayers({
                season_id: season.id,
                league_id: league.id,
                team_id: selectedTeam.id
            }).then((res) => {
                setTeamPlayerList(res);
            });
        } catch (e) {
            setTeamPlayerList([]);
        }
    }, [count, season, league, selectedTeam]);

    React.useEffect(() => {
        if (mounted.current) {
            selectedTeamCallBack(selectedTeam);
        } else {
            mounted.current = true;
        }
    }, [selectedTeam, selectedTeamCallBack]);

    const jerseyUpdatedCallBack = () => {
        setCount(count + 1);
        updatePlayerListCallBack();
    };

    const deletePlayerCallBack = (id) => {
        GameService.deletePlayersInTeam(id).then((res) => {
            setCount(count + 1);
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const addTeamPlayer = () => {
        if (!selectedPlayer) {
            openAlert('Please select player', 'warning');
            return;
        }
        if (!selectedTeam) {
            openAlert('Please select Team', 'warning');
            return;
        }
        if (!season) {
            openAlert('Please select Season', 'warning');
            return;
        }
        if (!league) {
            openAlert('Please select League', 'warning');
            return;
        }

        GameService.addTeamPlayer({
            season_id: season.id,
            league_id: league.id,
            team_id: selectedTeam.id,
            player_id: selectedPlayer.id
        }).then((res) => {
            if (res.status === 'success') {
                setCount(count + 1);
                openAlert(`Player is successfully added!`);
            } else {
                openAlert(res.data, 'error');
            }
        });
    };

    const openAlert = (text, type = 'success') => {
        setAlert(text);
        setOpen(true);
        setAlertType(type);
    };

    return (
        <div>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    {alert}
                </Alert>
            </Snackbar>

            <div style={{ display: 'flex' }}>
                <Autocomplete
                    id="combo-box-demo"
                    options={teamList}
                    value={selectedTeam}
                    isOptionEqualToValue={(option, value) => option && option.name.includes(value)}
                    getOptionLabel={(option) => (!option.name ? '' : option.name)}
                    fullWidth
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={`${t('Search')} ${teamtype === 'home' ? t('HomeTeam') : t('AwayTeam')}`} />}
                    onChange={(event, newValue) => {
                        setSelectedTeam(newValue);
                    }}
                />
            </div>
            <div style={{ display: 'flex' }}>
                <Autocomplete
                    id="combo-box-demo"
                    options={playerList}
                    value={selectedPlayer}
                    isOptionEqualToValue={(player, value) => player && player.player_name.includes(value)}
                    getOptionLabel={(player) => (!player.player_name ? '' : `${player.player_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`)}
                    fullWidth
                    renderOption={(props, player) => {
                        return (
                            <li {...props} key={player.id}>
                                {`${player.player_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField sx={{ my: 2 }} {...params} label={`${t('Search')} ${t('Player')}`} />}
                    onChange={(event, newValue) => {
                        setSelectedPlayer(newValue);
                    }}
                />
                <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={() => addTeamPlayer()}>
                    <AddCircleIcon />
                </IconButton>
            </div>
            <PlayerTable jerseyUpdatedCallBack={jerseyUpdatedCallBack} deletePlayerCallBack={deletePlayerCallBack} rows={teamPlayerList} t={t} />
        </div>
    );
}
