import React, { useState, useEffect, useCallback, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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

import Search from './search'
import GameService from "../../../services/game.service";
import Upload from '../../../common/upload';
import PlayerFormDialog from '../PlayerTab/PlayerFormDialog';
import TeamFormDialog from '../TeamTab/TeamFormDialog';

const useStyles = makeStyles((theme) => ({
  paper: { minWidth: "90%" },
  central: {
    '& > *': {
      margin: 6,
    },
  },
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
export default function GameFormDialog({ open, setOpen, gameListUpdated, actionType, editData }) {
  const classes = useStyles();
  const descriptionElementRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const [count, setCount] = useState(0);
  const [leagueOpen, setLeagueOpen] = useState(false);
  const [leagueName, setLeagueName] = useState("");
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
  const [alertType, setAlertType] = useState("success");
  const [image, setImage] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

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
    })
  }, [count]);

  useEffect(() => {
    if (actionType !== "Edit" || !leagueList.length || !seasonList.length) return;
    // setSeason(seasonList.find(s => s.id === editData.season_id));
    const editSeason = seasonList.find(s => s.id === editData.season_id);
    const editLeague = leagueList.find(s => s.id === editData.league_id);
    editSeason && setSeason(editSeason);
    editLeague && setLeague(editLeague);
    setGameDate(editData.date)
    setVideoUrl(editData.video_url);
  }, [editData, seasonList, leagueList, actionType])

  const getTeamList = () => GameService.getAllTeams().then((res) => setTeamList(res))
  const getPlayerList = () => GameService.getAllPlayers().then((res) => setPlayerList(res))
  const handleClickPlayerOpen = () => setPlayerOpen(true)
  const updatePlayerListCallBack = () => getPlayerList()
  const handleClickTeamOpen = () => setTeamOpen(true)
  const homeTeamCallBack = useCallback((param) => setHomeTeam(param), [])
  const awayTeamCallBack = useCallback((param) => setAwayTeam(param), [])

  useEffect(() => {
    getTeamList();
    getPlayerList();
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const OpenAlert = (msg, type = "success") => {
    setAlertOpen(true);
    setAlert(msg);
    setAlertType(type);
  }
  const gameClicked = () => {
    if (!homeTeam || !awayTeam || !season || !league || !videoUrl.length) {
      OpenAlert("Input enough data to add a new game!", "warning");
      return;
    }
    setLoading(true)

    if (actionType === "Add") {
      GameService.addGame({
        image,
        season_id: season.id,
        league_id: league.id,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        date: gameDate,
        video_url: videoUrl
      }).then((res) => {
        gameListUpdated();
        OpenAlert("Added a new game");
        setLoading(false)
      }).catch(() => { setLoading(false) })
    } else if (actionType === "Edit") {
      GameService.updateGame({
        id: editData.id,
        image,
        season_id: season.id,
        league_id: league.id,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        date: gameDate,
        video_url: videoUrl
      }).then((res) => {
        gameListUpdated();
        OpenAlert("Game is edited");
        setLoading(false)
      }).catch(() => { setLoading(false) })
    }
  }

  const handleLeagueClose = (result) => {
    setLeagueOpen(false);

    if (!result) return;
    GameService.addLeague({ name: leagueName }).then(
      (response) => {
        setCount(count + 1);
        OpenAlert(`${leagueName} is successfully added!`);
      },
      (error) => {
      }
    );
  };

  return (
    <Dialog
      open={open}
      classes={{ paper: classes.paper }}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {loading &&
        <div style={styles.loader}>
          <CircularProgress />
        </div>
      }
      <DialogTitle id="scroll-dialog-title">{actionType} Game</DialogTitle>
      <DialogContent
        dividers={true}
        style={{ height: '90vh' }}
        ref={descriptionElementRef}
      >
        <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
            {alert}
          </Alert>
        </Snackbar>
        <TeamFormDialog open={teamOpen} onResult={res => setTeamOpen(false)} />
        <PlayerFormDialog
          open={playerOpen}
          onResult={(res) => {
            setPlayerOpen(res.data);
            if (!!res?.msg) {
              OpenAlert(res.msg, res.result)
            }
            if (res?.type === "success") {
              getPlayerList();
            }
          }} />
        <Dialog open={leagueOpen} onClose={e => handleLeagueClose(false)}>
          <DialogTitle>Add New League</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new League, please input League name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={leagueName}
              onChange={e => setLeagueName(e.target.value)}
              label="League Name"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={e => handleLeagueClose(false)}>Cancel</Button>
            <Button onClick={e => handleLeagueClose(true)}>Add</Button>
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
              defaultTeamId={editData.home_team_id}
              updatePlayerListCallBack={updatePlayerListCallBack}
            />
          </Grid>
          <Grid item xs={4} className={classes.central}>

            <div style={{ textAlign: "center" }}>
              <Button
                sx={{ width: 120 }}
                variant="outlined"
                onClick={() => handleClickTeamOpen()}
                startIcon={<AddIcon />}
              >
                Team
              </Button>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                sx={{ width: 120 }}
                variant="outlined"
                onClick={e => handleClickPlayerOpen()}
                startIcon={<AddIcon />}
              >
                Player
              </Button>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Game Date"
                value={gameDate}
                onChange={(newValue) => {
                  setGameDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ my: 2 }} />}
              />
            </LocalizationProvider>
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
              renderInput={(params) => <TextField {...params} label="Season" sx={{ my: 1 }} />}
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
                getOptionLabel={
                  (option) => !option.name ? "" : option.name
                }
                fullWidth
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField {...params} label="League" sx={{ my: 1 }} />}
                onChange={(event, newValue) => {
                  setLeague(newValue);
                }}
              />
              <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => setLeagueOpen(true)}>
                <AddCircleIcon />
              </IconButton>
            </div>
            <TextField
              id="outlined-textarea"
              label="Video URL"
              placeholder="Video URL"
              multiline
              fullWidth
              sx={{ my: 1 }}
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
            />
            <Upload
              dirName={process.env.REACT_APP_DIR_TEAM}
              onURL={url => setImage(url)}
              defaultImg={TEAM_ICON_DEFAULT}
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
              defaultTeamId={editData.away_team_id}
              updatePlayerListCallBack={updatePlayerListCallBack}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button variant="outlined" onClick={gameClicked}>{actionType} Game</Button>
      </DialogActions>
    </Dialog>

  );
}