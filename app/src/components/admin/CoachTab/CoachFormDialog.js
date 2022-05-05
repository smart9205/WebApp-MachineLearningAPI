import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GameService from '../../../services/game.service';
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete } from '@mui/material';

const init = {
    season: null,
    league: null,
    team: null,
    coach: null,
}
const useStyles = makeStyles((theme) => ({
    paper: { minWidth: "80%" },
}));
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
export default function CoachFormDialog({ open, onResult, edit = null, t }) {
    const classes = useStyles();

    const [data, setData] = useReducer((old, action) => ({ ...old, ...action }), init)
    const { season, league, team, coach } = data
    const [loading, setLoading] = useState(false)
    const [seasonList, setSeasonList] = useState([])
    const [leagueList, setLeagueList] = useState([])
    const [teamList, setTeamList] = useState([])
    const [coachList, setCoachList] = useState([])

    useEffect(() => {
        GameService.getAllSeasons().then((res) => {
            setSeasonList(res);
        });
        GameService.getAllLeagues().then((res) => {
            setLeagueList(res);
        })
        GameService.getAllTeams().then((res) => {
            setTeamList(res);
        })
        GameService.getAllCoach().then((res) => {
            setCoachList(res);
        })
    }, []);

    useEffect(() => {
        if (!edit) return
        setData({
            coach: coachList.find(c => c.id === edit?.user_id),
            season: seasonList.find(c => c.id === edit?.season_id),
            league: leagueList.find(c => c.id === edit?.league_id),
            team: teamList.find(c => c.id === edit?.team_id),
        })
    }, [edit, coachList, seasonList, leagueList, teamList])

    const handleClose = (result) => {
        setLoading(true)

        if (result) {
            const req = {
                id: edit?.id,
                user_id: coach?.id,
                season_id: season?.id,
                league_id: league?.id,
                team_id: team?.id,
            }
            if (!edit) {
                GameService.addCoachTeam(req).then((res) => {
                    onResult(true)
                    setData(init)
                    setLoading(false)
                }).catch((e) => { onResult(false); setData(init); setLoading(false) });
            }
            else {
                GameService.updateCoachTeam(req).then((res) => {
                    onResult(true)
                    setData(init)
                    setLoading(false)
                }).catch((e) => { onResult(false); setData(init); setLoading(false) });
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={e => onResult(false)}
            classes={{ paper: classes.paper }}
        >
            {loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
            <DialogTitle>{!edit ? t("Add") : t("Edit")} {t("Coach")}</DialogTitle>
            <DialogContent >
                <Autocomplete
                    id="combo-box-demo"
                    options={seasonList}
                    value={season}
                    isOptionEqualToValue={(option, value) => option && option.name}
                    getOptionLabel={
                        (option) => !option.name ? "" : option.name
                    }
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t("Season")} sx={{ my: 1 }} />}
                    onChange={(event, newValue) => {
                        setData({ season: newValue });
                    }}
                />
                <Autocomplete
                    id="combo-box-demo"
                    options={leagueList}
                    value={league}
                    isOptionEqualToValue={(option, value) => option && option.name}
                    getOptionLabel={
                        (option) => !option.name ? "" : option.name
                    }
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t("League")} sx={{ my: 1 }} />}
                    onChange={(event, newValue) => {
                        setData({ league: newValue });
                    }}
                />
                <Autocomplete
                    id="combo-box-demo"
                    options={teamList}
                    value={team}
                    isOptionEqualToValue={(option, value) => option && option.name}
                    getOptionLabel={
                        (option) => !option.name ? "" : option.name
                    }
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t("Team")} sx={{ my: 1 }} />}
                    onChange={(event, newValue) => {
                        setData({ team: newValue });
                    }}
                />
                <Autocomplete
                    id="combo-box-demo"
                    options={coachList}
                    value={coach}
                    isOptionEqualToValue={(option, value) => option && option.first_name}
                    getOptionLabel={
                        (option) => !option.first_name ? "" : option.first_name + " " + option.last_name
                    }
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.first_name} {option.last_name}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t("Coach")} sx={{ my: 1 }} />}
                    onChange={(event, newValue) => {
                        setData({ coach: newValue });
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={e => onResult(false)}>{t("Cancel")}</Button>
                <Button onClick={e => handleClose(true)}>{t("Done")}</Button>
            </DialogActions>
        </Dialog>
    )
}