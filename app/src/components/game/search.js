import * as React from 'react';
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
  CardContent,
  Card
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import PlayerTable from "./PlayerTable"
import GameService from "../../services/game.service";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "10px 5px"
  }
}));

export default function SearchComponent({selectedTeamCallBack}) {
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

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [birth, setBirth] = React.useState(new Date());
  const [position, setPosition] = React.useState("");
  const [jerseyNumber, setJercyNumber] = React.useState(false);

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    GameService.getAllTeams().then((res) => {
      setTeamList(res);
    });
    GameService.getAllPlayers().then((res) => {
      console.log("players", res)
      setPlayerList(res);
    })
  }, [count])

  React.useEffect(() => {
    if (mounted.current) {
      selectedTeamCallBack(selectedTeam);
    } else {
      mounted.current = true;
    }
  }, [selectedTeam, selectedTeamCallBack])

  const playerSelectedCallBack = React.useCallback((param) => {
    console.log("Sl", param)
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
        setCount(count + 1);
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

    GameService.addNewPlayer({ 
      f_name: firstName,
      l_name: lastName,
      date_of_birth: birth,
      position: position,
      jersey_number: jerseyNumber,
    }).then((response) => {
        console.log("NewPlayer", response);
        setCount(count + 1);
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
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                label="First Name"
                fullWidth
                variant="outlined"
              />
              <TextField
                className={classes.input}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                label="Last  Name"
                fullWidth
                variant="outlined"
              />
            </div>
            <div style={{ display: 'flex' }}>
              <TextField
                className={classes.input}
                value={position}
                onChange={e => setPosition(e.target.value)}
                label="Position"
                fullWidth
                variant="outlined"
              />
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <DatePicker
                  label="Date of Birth"
                  value={birth}
                  onChange={(newValue) => {
                    setBirth(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} className={classes.input} />}
                />
              </LocalizationProvider>
            </div>
            <TextField
              label="Jercey Number"
              type="number"
              value={jerseyNumber}
              onChange={e => setJercyNumber(e.target.value)}
              className={classes.input}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={e => handlePlayerClose(false)}>Cancel</Button>
            <Button onClick={e => handlePlayerClose(true)}>Add</Button>
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
            renderInput={(params) => <TextField {...params} label="Search home team" />}
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