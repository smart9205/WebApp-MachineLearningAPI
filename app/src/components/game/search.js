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
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import GameService from "../../services/game.service";

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 }
];
const useStyles = makeStyles((theme) => ({
  input: {
    margin: "10px 5px"
  }
}));
export default function SearchComponent() {
  const classes = useStyles();
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [teamName, setTeamName] = React.useState("");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [birth, setBirth] = React.useState(new Date());
  const [position, setPosition] = React.useState("");
  const [jerseyNumber, setJercyNumber] = React.useState(false);


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
    }).then(
      (response) => {
        console.log("NewPlayer", response);
      },
      (error) => {
      }
    );
  };


  return (
    <div>
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
          options={top100Films}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search home team" />}
        />
        <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => handleClickTeamOpen()}>
          <AddCircleIcon />
        </IconButton>
      </div>
      <div style={{ display: 'flex' }}>
        <TextField
          sx={{ my: 2, width: 300 }}
          id="outlined-required"
          label="Search Players"
        />
        <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => handleClickPlayerOpen()}>
          <AddCircleIcon />
        </IconButton>
      </div>
    </div>
  );
}