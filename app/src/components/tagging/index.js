import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import { useParams } from "react-router-dom";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';
import GameService from '../../services/game.service';
import TagTable from "./tagTable"
import { Button } from '@mui/material'; import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import "./player.css";

const drawerWidth = "30%";

const ControlButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
  color: ${props => props.color};
  margin: 6px
`;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    display: 'flex',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);
const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  display: 'flex',
  // boxShadow: 24,
  justifyContent: 'center',
  p: 4,
};
const TagButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
  color: ${props => props.color};
  width: 100%
`;
const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
`;

export default function Tagging() {
  const { id } = useParams();
  const player = React.useRef(null);

  const seekTo = (sec) => {
    player.current.seekTo(player.current.getCurrentTime() + sec)
  }

  const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    url: "",
    offense: "home",
    first_second: "first",
    homeTeam: [],
    awayTeam: [],
  })
  const [modalState, setModalState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    offensePlayer: {},
    type: "Right",
    onTarget: "Yes",
    goal: "Yes",
    assistPlayer: {},
    saved: {}
  })
  const [videoState, setVideoState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    play: false
  })

  React.useEffect(() => {
    const game_id = atob(id).slice(3, -3)
    console.log("Game id", game_id)
    GameService.getGame(game_id).then((res) => {
      console.log("game Data", res);
      setState({ url: res.video_url });
    });

    GameService.getGameTeamPlayers({ game_id }).then((res) => {
      console.log("team players", res)
      setState({ homeTeam: res.home_team, awayTeam: res.away_team })
    })
  }, [id])

  const [open, setOpen] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const offenseTeam = () => state.offense === "home" ? state.homeTeam : state.awayTeam
  const defenseTeam = () => state.offense === "home" ? state.awayTeam : state.homeTeam

  return (
    <Box sx={{ display: 'flex' }}>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <SubBox>
            <List
              sx={{ bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  List of Players
                </ListSubheader>
              }
            >
              {
                offenseTeam().map((player, i) => (
                  <ListItemButton key={i}
                    selected={modalState.offensePlayer === player}
                    onClick={() => setModalState({ offensePlayer: player })}
                  >
                    <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
                  </ListItemButton>
                ))
              }
            </List>
          </SubBox>

          <SubBox>
            <List
              sx={{ bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Type
                </ListSubheader>
              }
            >
              {
                ["Right", "Left", "Header"].map((type, i) => (
                  <ListItemButton key={i}
                    selected={modalState.type === type}
                    onClick={() => setModalState({ type })}
                  >
                    <ListItemText primary={type} />
                  </ListItemButton>
                ))
              }
            </List>
          </SubBox>
          <SubBox>
            <List
              sx={{ bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  On Target
                </ListSubheader>
              }
            >
              {
                ["Yes", "No"].map((target, i) => (
                  <ListItemButton key={i}
                    selected={modalState.onTarget === target}
                    onClick={() => setModalState({ onTarget: target })}
                  >
                    <ListItemText primary={target} />
                  </ListItemButton>
                ))
              }
            </List>
          </SubBox>
          {
            modalState.onTarget === "Yes" &&
            <SubBox>
              <List
                sx={{ bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Goal
                  </ListSubheader>
                }
              >
                {
                  ["Yes", "No"].map((goal, i) => (
                    <ListItemButton key={i}
                      selected={modalState.goal === goal}
                      onClick={() => setModalState({ goal })}
                    >
                      <ListItemText primary={goal} />
                    </ListItemButton>
                  ))
                }
              </List>
            </SubBox>
          }
          {
            modalState.onTarget === "Yes" && modalState.goal === "Yes" &&
            <SubBox>
              <List
                sx={{ bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Assist
                  </ListSubheader>
                }
              >
                {
                  offenseTeam().map((player, i) => (
                    <ListItemButton key={i} selected={modalState.assistPlayer === player}
                      onClick={() => setModalState({ assistPlayer: player })}
                    >
                      <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
                    </ListItemButton>
                  ))
                }
              </List>
            </SubBox>
          }
          <SubBox>
            <List
              sx={{ bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Saved
                </ListSubheader>
              }
            >
              {
                defenseTeam().map((player, i) => (
                  <ListItemButton key={i}
                    selected={modalState.saved === player}
                    onClick={() => setModalState({ saved: player })}
                  >
                    <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
                  </ListItemButton>
                ))
              }
            </List>
          </SubBox>
        </Box>
      </Modal>
      <CssBaseline />
      <Drawer
        sx={{
          width: "30%",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "30%",
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <TagTable title="Team Tags" />
        <TagTable title="Individual Tags" />
      </Drawer>
      <Main open={open}>
        <div style={{ width: 50 }}>
          <Tooltip title={`${open ? "Close" : "Open"} Tags`}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ height: 50, width: 50, position: 'fixed', zIndex: 1300, top: '45%', }}
            >
              {open ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </Tooltip>
        </div>
        <Box>
          <div>
            <div>
              <ReactPlayer
                style={{margin:"auto"}}
                url={state.url}
                ref={player}
                playing={videoState.play}
                // controls={true}
                width={open ? '100%' : '70%'}
                height='100%'
              />
            </div>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              {videoState.play ?
                <ControlButton style={{ width: 100 }} startIcon={<PauseCircleOutlineIcon />} onClick={() => setVideoState({play: false})}>
                  Pause
                </ControlButton>
                :
                <ControlButton style={{ width: 100 }} startIcon={<PlayCircleOutlineIcon />} onClick={() => setVideoState({play: true})}>
                  Play
                </ControlButton>
              }
              <ControlButton onClick={() => seekTo(-10)}>
                -10s
              </ControlButton>
              <ControlButton onClick={() => seekTo(-5)}>
                -5s
              </ControlButton>
              <ControlButton onClick={() => seekTo(-3)}>
                -3s
              </ControlButton>
              <ControlButton onClick={() => seekTo(-1)}>
                -1s
              </ControlButton>
              <ControlButton onClick={() => seekTo(1)}>
                +1s
              </ControlButton>
              <ControlButton onClick={() => seekTo(3)}>
                +3s
              </ControlButton>
              <ControlButton onClick={() => seekTo(5)}>
                +5s
              </ControlButton>
              <ControlButton onClick={() => seekTo(10)}>
                +10s
              </ControlButton>
            </Box>
          </div>
          <div style={{ display: 'flex' }}>
            <FormControl component="fieldset" style={{ minWidth: "300px" }}>
              {/* <FormLabel component="legend">Offense Team</FormLabel> */}
              <RadioGroup
                row
                aria-label="offenseTeam"
                name="row-radio-buttons-group"
                value={state.offense}
                sx={{ my: 0, mx: "auto" }}
                onChange={e => setState({ offense: e.target.value })}
              >
                <FormControlLabel value="home" control={<Radio />} label="Home Team" />
                <FormControlLabel value="away" control={<Radio />} label="Away Team" />
              </RadioGroup>
              <Button variant="outlined" sx={{ mx: "auto" }}>C.P.</Button>
              <RadioGroup
                row
                aria-label="firstsecond"
                name="row-radio-buttons-group"
                value={state.first_second}
                sx={{ my: 0, mx: "auto" }}
                onChange={e => setState({ first_second: e.target.value })}
              >
                <FormControlLabel value="first" control={<Radio />} label="1st half" />
                <FormControlLabel value="second" control={<Radio />} label="2nd half" />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2} sx={{ textAlign: 'center', mt: 1 }}>
              {[
                "Shot",
                "Pass",
                "Cross",
                "Penality",
                "Free Kick",
                "Corner",
                "Dribble",
                "Foul"
              ].map((title, i) => (
                <Grid key={i} item xs={6} md={3} onClick={() => {setModalOpen(true);setVideoState({play: false})}}>
                  <TagButton>{title}</TagButton>
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      </Main>
    </Box>
  );
}
