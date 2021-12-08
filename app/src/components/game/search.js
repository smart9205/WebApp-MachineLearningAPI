import * as React from 'react';
import { useSelector, useDispatch } from "react-redux";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  TextField,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import PlayerTable from "./PlayerTable"
import GameService from "../../services/game.service";
import { UPDATE_COUNT } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "10px 5px"
  }
}));

export default function SearchComponent({
  selectedTeamCallBack, 
  teamtype,
  season,
  league,
}) {
  const classes = useStyles();
  
  const mounted = React.useRef(false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [teamList, setTeamList] = React.useState([]);
  const [playerList, setPlayerList] = React.useState([]);
  const [playerSearch, setPlayerSearch] = React.useState("");

  const [playerOpen, setPlayerOpen] = React.useState(false);
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [teamName, setTeamName] = React.useState("");

  const [playerData, setPlayerData] = React.useState({
    f_name: "",
    l_name: "",
    date_of_birth: new Date(),
    position: "",
    jersey_number: 1
  });
  const [error, setError] = React.useState({
    f_name: false,
    l_name: false,
    position: false,
    jersey_number: false
  });
  
  const { updateCnt } = useSelector(state => state.game);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    GameService.getAllTeams().then((res) => {
      setTeamList(res);
      setSelectedTeam(res[0]);
    });
  }, [updateCnt]);
  
  React.useEffect(() => {
    try{
      if(!season.id || !league.id || !selectedTeam.id) return;
      GameService.getAllTeamPlayers({
        season_id: season.id,
        league_id: league.id,
        team_id: selectedTeam.id
      }).then((res) => {
        console.log("players", res, updateCnt)
        setPlayerList(res);
      })
    } catch(e) {
      setPlayerList([]);
    }
  }, [updateCnt, season, league, selectedTeam])
  
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
  
  const handleClickTeamOpen = () => {
    setTeamOpen(true);
  };
  const handleClickPlayerOpen = () => {
    setPlayerOpen(true);
  };
  
  const handleTeamClose = (result) => {
    setTeamOpen(false);
    
    if(!result) return;
    GameService.addNewTeam({ name: teamName }).then(
      (response) => {
        console.log("NewTeam", response);
        dispatch({
          type: UPDATE_COUNT
        });
        setOpen(true);
        setAlert(`${teamName} is successfully added!`);
      },
      (error) => {
      }
      );
    };
    const handlePlayerClose = (result) => {
      setPlayerOpen(false);
      
      if(!result) return;

      console.log("checkadd", checkErrorPlayer());
      if(checkErrorPlayer()) return;
      
      GameService.addNewTeamPlayer({ 
        ...playerData,
        season_id: season.id,
        league_id: league.id,
        team_id: selectedTeam.id
      }).then((response) => {
        console.log("NewPlayer", response);
        dispatch({
          type: UPDATE_COUNT
        });
        setOpen(true);
        setAlert(`${response.f_name} ${response.l_name} is successfully added!`);
      },
      (error) => {
      }
      );
    };
    
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      
      setOpen(false);
    };
    
    const handleChange = name => event => {
      setPlayerData({ ...playerData, [name]: event.target.value });
    };
    
    React.useEffect(() => {
      setError({
        f_name: playerData.f_name.length === 0,
        l_name: playerData.l_name.length === 0,
        position: playerData.position.length === 0,
        jersey_number: Number(playerData.jersey_number) <= 0
      })
      console.log("palyer", playerData)
    }, [playerData])

    const checkErrorPlayer = () => {
      return !(Object.keys(error).find(key => error[key]));
    }

    return (
      // <Card sx={{ minWidth: 275 }}>
      //   <CardContent>
      <div>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
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

        <Dialog open={playerOpen} onClose={e => handlePlayerClose(false)}>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add new Player, please input Player details
            </DialogContentText>
            <div style={{ display: 'flex' }}>
              <TextField
                autoFocus
                className={classes.input}
                value={playerData.f_name}
                onChange={handleChange("f_name")}
                helperText={error.f_name ? "First Name cannot be empty" : ""}
                error={error.f_name}
                label="First Name"
                fullWidth
                variant="outlined"
              />
              <TextField
                className={classes.input}
                value={playerData.l_name}
                onChange={handleChange("l_name")}
                helperText={error.l_name ? "Last Name cannot be empty" : ""}
                error={error.l_name}
                label="Last  Name"
                fullWidth
                variant="outlined"
              />
            </div>
            <div style={{ display: 'flex' }}>
              <TextField
                className={classes.input}
                value={playerData.position}
                onChange={handleChange("position")}
                helperText={error.position ? "Position cannot be empty" : ""}
                error={error.position}
                label="Position"
                fullWidth
                variant="outlined"
              />
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <DatePicker
                  label="Date of Birth"
                  value={playerData.date_of_birth}
                  onChange={handleChange("date_of_birth")}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      className={classes.input} 
                    />
                  }
                />
              </LocalizationProvider>
            </div>
            <TextField
              label="Jercey Number"
              type="number"
              value={playerData.jersey_number}
              onChange={handleChange("jersey_number")}
              helperText={error.jersey_number ? "Jersey Number cannot be less than 0" : ""}
              error={error.jersey_number}
              className={classes.input}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={e => handlePlayerClose(false)}>Cancel</Button>
            <Button onClick={e => checkErrorPlayer() && handlePlayerClose(true)}>Add</Button>
          </DialogActions>
        </Dialog>

        <div style={{ display: 'flex' }}>
          <Autocomplete
            id="combo-box-demo"
            options={teamList}
            value={selectedTeam}
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
            renderInput={(params) => <TextField {...params} label={`Search ${teamtype} team`} />}
            onChange={(event, newValue) => {
              setSelectedTeam(newValue);
            }}
          />
    
          <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => handleClickTeamOpen()}>
            <AddCircleIcon />
          </IconButton>
        </div>
        <div style={{ display: 'flex' }}>
          <TextField
            sx={{ my: 2 }}
            id="outlined-required"
            label="Search Players"
            value={playerSearch}
            fullWidth
            onChange={(e) => setPlayerSearch(e.target.value)}
          />
          <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => handleClickPlayerOpen()}>
            <AddCircleIcon />
          </IconButton>
        </div>
        <PlayerTable 
          playerSelectedCallBack={playerSelectedCallBack} 
          rows={playerList.filter(p => `${p.f_name} ${p.l_name}`.toLowerCase().includes(playerSearch.toLowerCase()))}
        />
      {/* </CardContent>
   </Card> */}
    </div>
  );
}