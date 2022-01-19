import * as React from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
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

import Search from './search'
import GameService from "../../../services/game.service";
import PlayerFormDialog from './PlayerFormDialog';

const useStyles = makeStyles((theme) => ({
  central: {
    '& > *': {
      margin: 6,
    },
  },
}));

export default function Content({ gameListUpdated, actionType, editData }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [leagueOpen, setLeagueOpen] = React.useState(false);
  const [leagueName, setLeagueName] = React.useState("");
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [teamName, setTeamName] = React.useState("");

  const [gameDate, setGameDate] = React.useState(new Date());
  const [season, setSeason] = React.useState({});
  const [league, setLeague] = React.useState({});
  const [seasonList, setSeasonList] = React.useState([]);
  const [leagueList, setLeagueList] = React.useState([]);
  const [teamList, setTeamList] = React.useState([]);
  const [playerList, setPlayerList] = React.useState([]);

  const [homeTeam, setHomeTeam] = React.useState(false);
  const [awayTeam, setAwayTeam] = React.useState(false);
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState("success");

  const [videoUrl, setVideoUrl] = React.useState("");

  React.useEffect(() => {
    GameService.getAllSeasons().then((res) => {
      setSeasonList(res);
      setSeason(res[0]);
    });
    GameService.getAllLeagues().then((res) => {
      setLeagueList(res);
      setLeague(res[0]);
    })
  }, [count]);

  React.useEffect(() => {
    if (actionType !== "Edit" || !leagueList.length || !seasonList.length) return;
    // setSeason(seasonList.find(s => s.id === editData.season_id));
    const editSeason = seasonList.find(s => s.id === editData.season_id);
    const editLeague = leagueList.find(s => s.id === editData.league_id);
    editSeason && setSeason(editSeason);
    editLeague && setLeague(editLeague);
    setGameDate(editData.date)
    setVideoUrl(editData.video_url);
  }, [editData, seasonList, leagueList, actionType])

  const getTeamList = () => {
    GameService.getAllTeams().then((res) => {
      setTeamList(res);
    });
  }
  const getPlayerList = () => {
    GameService.getAllPlayers().then((res) => {
      setPlayerList(res);
    });
  }
  const handleClickPlayerOpen = () => {
    setPlayerOpen(true);
  };
  React.useEffect(() => {
    getTeamList();
    getPlayerList();
  }, []);

  const updatePlayerListCallBack = () => {
    getPlayerList();
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleClickTeamOpen = () => {
    setTeamOpen(true);
  };
  const handleTeamClose = (result) => {
    setTeamOpen(false);

    if (!result) return;
    GameService.addTeam({ name: teamName, image: "" }).then(
      (res) => {
        if (res.status === "success") {
          getTeamList();
          OpenAlert(`${teamName} is successfully added!`);
        } else {
          OpenAlert(res.data, "error");
        }
      },
      (error) => {
        console.log("ERROR", error);
      }
    );
  };

  const OpenAlert = (msg, type = "success") => {
    setOpen(true);
    setAlert(msg);
    setAlertType(type);
  }
  const gameClicked = () => {
    if (!homeTeam || !awayTeam || !season || !league || !videoUrl.length) {
      OpenAlert("Input enough data to add a new game!", "warning");
      return;
    }

    if (actionType === "Add") {
      GameService.addGame({
        season_id: season.id,
        league_id: league.id,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        date: gameDate,
        video_url: videoUrl
      }).then((res) => {
        gameListUpdated();
        OpenAlert("Added a new game");
      })
    } else if (actionType === "Edit") {
      GameService.updateGame({
        id: editData.id,
        season_id: season.id,
        league_id: league.id,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        date: gameDate,
        video_url: videoUrl
      }).then((res) => {
        gameListUpdated();
        OpenAlert("Game is edited");
      })
    }
  }

  const homeTeamCallBack = React.useCallback((param) => {
    setHomeTeam(param);
  }, []);

  const awayTeamCallBack = React.useCallback((param) => {
    setAwayTeam(param);
  }, []);

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
    <Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          {alert}
        </Alert>
      </Snackbar>
      <Dialog open={teamOpen} onClose={e => handleTeamClose(false)}>
        <DialogTitle>Add New Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new Team, please input Team name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            label="Team Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => handleTeamClose(false)}>Cancel</Button>
          <Button onClick={e => handleTeamClose(true)}>Add</Button>
        </DialogActions>
      </Dialog>
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
          <div style={{ textAlign: "center" }}>
            <Button variant="outlined" sx={{ mt: 5 }} onClick={gameClicked}>{actionType} Game</Button>
          </div>
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
    </Box>
  );
}