import React, { useState, useEffect, useCallback, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import CircularProgress from '@mui/material/CircularProgress';

import Search from './search';
import GameService from '../../../services/game.service';
import Upload from '../../../common/upload';
import PlayerFormDialog from '../PlayerTab/PlayerFormDialog';
import TeamFormDialog from '../TeamTab/TeamFormDialog';

const useStyles = makeStyles((theme) => ({
    paper: { minWidth: '90%' },
    central: {
        '& > *': {
            margin: 6
        }
    }
}));
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
export default function GameFormDialog({ open, setOpen, gameListUpdated, actionType, editData, t }) {
    const classes = useStyles();
    const descriptionElementRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [count, setCount] = useState(0);
    const [leagueOpen, setLeagueOpen] = useState(false);
    const [leagueName, setLeagueName] = useState('');
    const [teamOpen, setTeamOpen] = useState(false);

    const [gameDate, setGameDate] = useState(new Date());
    const [season, setSeason] = useState({});
    const [league, setLeague] = useState({});
    const [seasonList, setSeasonList] = useState([]);
    const [leagueList, setLeagueList] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [playerList, setPlayerList] = useState([]);

    const [homeTeam, setHomeTeam] = useState(false);
    const [awayTeam, setAwayTeam] = useState(false);
    const [playerOpen, setPlayerOpen] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [image, setImage] = useState('');

    const [videoUrl, setVideoUrl] = useState('');
    const [mobileVideoUrl, setMobileVideoUrl] = useState('');

    const [doneTagging, setDoneTagging] = useState(false);
    const [muteVideo, setMuteVideo] = useState(true);

    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        GameService.getAllSeasons().then((res) => {
            setSeasonList(res);
            setSeason(res[0]);
        });
        GameService.getAllLeagues().then((res) => {
            setLeagueList(res);
            setLeague(res[0]);
        });
    }, [count]);

    useEffect(() => {
        if (actionType !== 'Edit' || !leagueList.length || !seasonList.length) return;
        // setSeason(seasonList.find(s => s.id === editData.season_id));
        const editSeason = seasonList.find((s) => s.id === editData.season_id);
        const editLeague = leagueList.find((s) => s.id === editData.league_id);
        editSeason && setSeason(editSeason);
        editLeague && setLeague(editLeague);
        setGameDate(editData.date);
        setVideoUrl(editData.video_url);
        setMobileVideoUrl(editData.mobile_video_url);
        setDoneTagging(editData.done_tagging);
    }, [editData, seasonList, leagueList, actionType]);

    const getTeamList = () => GameService.getAllTeams().then((res) => setTeamList(res));
    const getPlayerList = () => GameService.getAllPlayers().then((res) => setPlayerList(res));
    const handleClickPlayerOpen = () => setPlayerOpen(true);
    const updatePlayerListCallBack = () => getPlayerList();
    const handleClickTeamOpen = () => setTeamOpen(true);
    const homeTeamCallBack = useCallback((param) => setHomeTeam(param), []);
    const awayTeamCallBack = useCallback((param) => setAwayTeam(param), []);

    useEffect(() => {
        getTeamList();
        getPlayerList();
    }, []);

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
    const gameClicked = () => {
        if (!homeTeam || !awayTeam || !season || !league || !videoUrl?.length) {
            OpenAlert('Input enough data to add a new game!', 'warning');
            return;
        }
        setLoading(true);

        if (actionType === 'Add') {
            GameService.addGame({
                image,
                season_id: season.id,
                league_id: league.id,
                home_team_id: homeTeam.id,
                away_team_id: awayTeam.id,
                date: gameDate,
                video_url: videoUrl,
                mobile_video_url: mobileVideoUrl ? mobileVideoUrl : videoUrl,
                mute_video: muteVideo,
                done_tagging: doneTagging
            })
                .then((res) => {
                    gameListUpdated();
                    OpenAlert(t('addedGame'));
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else if (actionType === 'Edit') {
            GameService.updateGame({
                id: editData.id,
                image,
                season_id: season.id,
                league_id: league.id,
                home_team_id: homeTeam.id,
                away_team_id: awayTeam.id,
                date: gameDate,
                video_url: videoUrl,
                mobile_video_url: mobileVideoUrl ? mobileVideoUrl : videoUrl,
                mute_video: muteVideo,
                done_tagging: doneTagging
            })
                .then((res) => {
                    gameListUpdated();
                    OpenAlert(t('editedGame'));
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    };

    const handleLeagueClose = (result) => {
        setLeagueOpen(false);

        if (!result) return;
        GameService.addLeague({ name: leagueName }).then(
            (response) => {
                setCount(count + 1);
                OpenAlert(`${leagueName} ${t('successAdd')}`);
            },
            (error) => {}
        );
    };

    return (
        <Dialog open={open} classes={{ paper: classes.paper }} onClose={() => setOpen(false)} scroll="paper" aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
            {loading && (
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            )}
            <DialogTitle id="scroll-dialog-title">
                {actionType === 'Add' ? t('Add') : t('Edit')} {t('Game')}
            </DialogTitle>
            <DialogContent dividers={true} style={{ height: '90vh' }} ref={descriptionElementRef}>
                <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                        {alert}
                    </Alert>
                </Snackbar>
                <TeamFormDialog open={teamOpen} onResult={(res) => setTeamOpen(false)} t={t} />
                <PlayerFormDialog
                    open={playerOpen}
                    onResult={(res) => {
                        setPlayerOpen(res.data);
                        if (!!res?.msg) {
                            OpenAlert(res.msg, res.result);
                        }
                        if (res?.type === 'success') {
                            getPlayerList();
                        }
                    }}
                    t={t}
                />
                <Dialog open={leagueOpen} onClose={(e) => handleLeagueClose(false)}>
                    <DialogTitle>{t('newLeagueTitle')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('newLeagueText')}</DialogContentText>
                        <TextField autoFocus margin="dense" id="name" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} label="League Name" fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => handleLeagueClose(false)}>{t('Cancel')}</Button>
                        <Button onClick={(e) => handleLeagueClose(true)}>{t('Add')}</Button>
                    </DialogActions>
                </Dialog>

                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <Search
                            teamtype="home"
                            selectedTeamCallBack={homeTeamCallBack}
                            season={season}
                            league={league}
                            teamList={teamList}
                            playerList={playerList}
                            defaultTeamId={editData?.home_team_id}
                            updatePlayerListCallBack={updatePlayerListCallBack}
                            t={t}
                        />
                    </Grid>
                    <Grid item xs={4} className={classes.central}>
                        <div style={{ textAlign: 'center' }}>
                            <Button sx={{ width: 120 }} variant="outlined" onClick={() => handleClickTeamOpen()} startIcon={<AddIcon />}>
                                {t('Team')}
                            </Button>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Button sx={{ width: 120 }} variant="outlined" onClick={(e) => handleClickPlayerOpen()} startIcon={<AddIcon />}>
                                {t('Player')}
                            </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <FormControlLabel
                                sx={{ mt: 1 }}
                                control={<Switch checked={muteVideo} onChange={() => setMuteVideo(!muteVideo)} inputProps={{ 'aria-label': 'controlled' }} />}
                                label={`${t('Mute Video')}`}
                            />
                            <FormControlLabel
                                sx={{ mt: 1 }}
                                control={<Switch checked={doneTagging} onChange={() => setDoneTagging(!doneTagging)} inputProps={{ 'aria-label': 'controlled' }} />}
                                label={`${t('Done Tagging')}`}
                            />
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t('gameDate')}
                                value={gameDate}
                                onChange={(newValue) => {
                                    setGameDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                        <Autocomplete
                            id="combo-box-demo"
                            options={seasonList}
                            value={season}
                            isOptionEqualToValue={(option, value) => option && option.name}
                            getOptionLabel={(option) => (!option.name ? '' : option.name)}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label={t('Season')} sx={{ my: 1 }} />}
                            onChange={(event, newValue) => {
                                setSeason(newValue);
                            }}
                        />
                        <div style={{ display: 'flex' }}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={leagueList}
                                value={league}
                                isOptionEqualToValue={(option, value) => option && option.name}
                                getOptionLabel={(option) => (!option.name ? '' : option.name)}
                                fullWidth
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => <TextField {...params} label={t('League')} sx={{ my: 1 }} />}
                                onChange={(event, newValue) => {
                                    setLeague(newValue);
                                }}
                            />
                            <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={(e) => setLeagueOpen(true)}>
                                <AddCircleIcon />
                            </IconButton>
                        </div>
                        <TextField
                            id="outlined-textarea"
                            label={t('VideoURL')}
                            placeholder={t('VideoURL')}
                            multiline
                            fullWidth
                            sx={{ my: 1 }}
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        <TextField
                            id="outlined-textarea"
                            label={t('MobileVideoURL')}
                            placeholder={t('MobileVideoURL')}
                            multiline
                            fullWidth
                            sx={{ my: 1 }}
                            value={mobileVideoUrl}
                            onChange={(e) => setMobileVideoUrl(e.target.value)}
                        />
                        <Upload
                            dirName={process.env.REACT_APP_DIR_GAME}
                            onURL={(url) => setImage(url)}
                            defaultImg={editData?.image?.length > 0 ? editData?.image : TEAM_ICON_DEFAULT}
                            btn_name={t('Upload')}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Search
                            teamtype="away"
                            selectedTeamCallBack={awayTeamCallBack}
                            season={season}
                            league={league}
                            teamList={teamList}
                            playerList={playerList}
                            defaultTeamId={editData?.away_team_id}
                            updatePlayerListCallBack={updatePlayerListCallBack}
                            t={t}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>{t('Close')}</Button>
                <Button variant="outlined" onClick={gameClicked}>
                    {actionType === 'Add' ? t('Add') : t('Edit')} {t('Game')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
