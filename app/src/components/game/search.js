import * as React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  TextField,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';


import PlayerTable from "./PlayerTable"
import GameService from "../../services/game.service";
import gameService from '../../services/game.service';

export default function SearchComponent({
  selectedTeamCallBack,
  teamtype,
  season,
  league,
  teamList,
  playerList
}) {
  const mounted = React.useRef(false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [selectedPlayer, setSelectedPlayer] = React.useState("");
  const [teamPlayerList, setTeamPlayerList] = React.useState([]);

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    try {
      if (!season.id || !league.id || !selectedTeam.id) return;
      GameService.getAllTeamPlayers({
        season_id: season.id,
        league_id: league.id,
        team_id: selectedTeam.id
      }).then((res) => {
        setTeamPlayerList(res);
      })
    } catch (e) {
      setTeamPlayerList([]);
    }
  }, [count, season, league, selectedTeam])

  React.useEffect(() => {
    if (mounted.current) {
      selectedTeamCallBack(selectedTeam);
    } else {
      mounted.current = true;
    }
  }, [selectedTeam, selectedTeamCallBack])

  const playerSelectedCallBack = React.useCallback((param) => {
    console.log("selected players", param)
  }, []);

  const deletePlayerCallBack = (id) => {
    console.log("delete players", id)
    gameService.deletePlayersInTeam(id).then((res) => {
      console.log("delete", res)
      setCount(count + 1);
    })
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const addTeamPlayer = () => {
    if(!selectedPlayer) {openAlert("Please select player"); return;}
    if(!selectedTeam) {openAlert("Please select Team"); return;}
    if(!season) {openAlert("Please select Season"); return;}
    if(!league) {openAlert("Please select League"); return;}
    
    gameService.addTeamPlayer({
      season_id: season.id,
      league_id: league.id,
      team_id: selectedTeam.id,
      player_id: selectedPlayer.id
    }).then((res) => {
      setCount(count + 1);
    })
  }

  const openAlert = (text) => {
    setAlert(text);
    setOpen(true);
  }

  return (
    <div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {alert}
        </Alert>
      </Snackbar>

      <div style={{ display: 'flex' }}>
        <Autocomplete
          id="combo-box-demo"
          options={teamList}
          value={selectedTeam}
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
          renderInput={(params) => <TextField {...params} label={`Search ${teamtype} team`} />}
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
          isOptionEqualToValue={(option, value) => option && option.f_name}
          getOptionLabel={
            (option) => !option.f_name ? "" : `${option.f_name} ${option.l_name} (${option.date_of_birth && option.date_of_birth.slice(0, 10)})`
          }
          fullWidth
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {`${option.f_name} ${option.l_name} (${option.date_of_birth && option.date_of_birth.slice(0, 10)})`}
              </li>
            );
          }}
          renderInput={(params) => <TextField sx={{ my: 2 }} {...params} label={`Search Player`} />}
          onChange={(event, newValue) => {
            setSelectedPlayer(newValue);
          }}
        />
        {/* <TextField
            sx={{ my: 2 }}
            id="outlined-required"
            label="Search Players"
            value={playerSearch}
            fullWidth
            onChange={(e) => setPlayerSearch(e.target.value)}
          /> */}
        <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={() => addTeamPlayer()}>
          <AddCircleIcon />
        </IconButton>
      </div>
      <PlayerTable
        playerSelectedCallBack={playerSelectedCallBack}
        deletePlayerCallBack={deletePlayerCallBack}
        rows={teamPlayerList}
      />
    </div>
  );
}