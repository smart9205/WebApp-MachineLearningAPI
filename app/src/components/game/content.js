import * as React from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Grid from '@mui/material/Grid';

import Search from './search'
import GameService from "../../services/game.service";

const useStyles = makeStyles((theme) => ({
  central: {
    '& > *': {
      margin: 5,
    },
  },
}));

export default function Content() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [gameDate, setGameDate] = React.useState(new Date());
  const [season, setSeason] = React.useState(false);
  const [league, setLeague] = React.useState(false);
  const [seasonList, setSeasonList] = React.useState(false);
  const [leagueList, setLeagueList] = React.useState(false);
  

  const [homeTeam, setHomeTeam] = React.useState(false);
  const [awayTeam, setAwayTeam] = React.useState(false);

  React.useEffect(() => {
    GameService.getAllSeasons().then((res) => {
      setSeasonList(res);
    });
    GameService.getAllLeagues().then((res) => {
      setLeagueList(res);
    })
  }, []);
 
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const addGame = () => {
    if(!homeTeam || !awayTeam || !season || !league) {
      setOpen(true);
      setAlert("Selected enough data to add a new game!");
    }

    GameService.addNewGame({
      season_id: season.id,
      league_id: league.id,
      home_team_id: homeTeam.id,
      away_team_id: awayTeam.id,
      date: gameDate
    }).then((res) => {
      console.log("Add Game Result", res);
      setOpen(true);
      setAlert("Added a new game");
    })
  }

  const homeTeamCallBack = React.useCallback((param) => {
    console.log("homeTeamCallBack", param);
    setHomeTeam(param);
  }, []);

 const awayTeamCallBack = React.useCallback((param) => {
    console.log("awayTeamCallBack", param);
    setAwayTeam(param);
  }, []);

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {alert}
        </Alert>
      </Snackbar>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Search team="home" selectedTeamCallBack={homeTeamCallBack}/>
        </Grid>
        <Grid item xs={4} className={classes.central}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Game Date"
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
            isOptionEqualToValue={(option, value) => option && option.name }
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
            renderInput={(params) => <TextField {...params} label="Search home team" />}
            onChange={(event, newValue) => {
              setSeason(newValue);
            }}
          />

          <Autocomplete
            id="combo-box-demo"
            options={leagueList}
            value={league}
            isOptionEqualToValue={(option, value) => option && option.name }
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
            renderInput={(params) => <TextField {...params} label="Search home team" />}
            onChange={(event, newValue) => {
              setLeague(newValue);
            }}
          />
          {/* <TextField
            value={season}
            onChange={e => setSeason(e.target.value)}
            label="Season Name"
            fullWidth
            variant="outlined"
          />
          <TextField
            value={league}
            onChange={e => setLeague(e.target.value)}
            label="League Name"
            fullWidth
            variant="outlined"
          /> */}
          <div style={{textAlign: "center"}}>
          <Button variant="outlined" sx={{mt: 5}} onClick={addGame}>Add Game</Button>
          </div>
        </Grid>
        <Grid item xs={4}>
          <Search team="away" selectedTeamCallBack={awayTeamCallBack}/>
        </Grid>
      </Grid>
    </Box>
  );
}