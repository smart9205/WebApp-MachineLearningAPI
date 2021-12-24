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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useParams } from "react-router-dom";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';
import GameService from '../../services/game.service';
import IndividualTagTable from "./IndividualTagTable"
import TeamTagTable from "./TeamTagTable"
import { Button } from '@mui/material'; import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toHHMMSS, getUser, setUser } from "../../common/utilities"
import "./Player.css";

const drawerWidth = "30%";

const PLAYBACK_RATE = [
  { rate: 0.3, label: "x 0.3" },
  { rate: 0.5, label: "x 0.5" },
  { rate: 1, label: "x 1" },
  { rate: 1.5, label: "x 1.5" },
  { rate: 2, label: "x 2" },
  { rate: 2.5, label: "x 2.5" },
  { rate: 3, label: "x 3" }
];

const Default = {
  shot: {
    type: "Right",
    on_target: "Yes",
    goal: "No",
  }
}

const DISPLAY_DATA = {
  shot: {
    type: ["Right", "Left","Header"],
    on_target: ["Yes","No"],
    goal: ["Yes", "No"]
  }
}

const ControlButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
  color: ${props => props.color};
  margin: 4px;
  text-transform: none
`;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    display: 'block',
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
  const game_id = Number(atob(id).slice(3, -3))
  const player = React.useRef(null)

  const seekTo = (sec) => player.current.seekTo(player.current.getCurrentTime() + sec)

  const [open, setOpen] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false)

  const [count, setCount] = React.useState(0)
  const [teamTagList, setTeamTagList] = React.useState([])
  const [indTagList, setIndTagList] = React.useState([])
  const [tagCnt, setTagCnt] = React.useState(0)
  const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    url: "",
    offense: "home",
    first_second: "first",
    home_team_name: "",
    away_team_name: "",
    homePlayers: [],
    awayPlayers: [],
  })

  const [config, setConfig] = React.useReducer((old, action) => ({ ...old, ...action }), {
    sec_before: getUser()?.user_config ? getUser()?.user_config.sec_before : 3,
    sec_after: getUser()?.user_config ? getUser()?.user_config.sec_after : 10,
  })
  const [modalState, setModalState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    offensePlayer: {},
    type: "Right",
    onTarget: "Yes",
    goal: "No",
    assistPlayer: {},
    saved: {}
  })
  const [videoState, setVideoState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    play: false,
    playbackRate: 3
  })

  const [teamTag, setTeamTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
    game_id,
    offensive_team_id: 0,
    defensive_team_id: 0,
    start_time: "00:00:00",
    end_time: "00:00:00",
  })
  const [indTag, setIndTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
    team_tag_id: 0,
    team_id: 0,
    action_id: 0,
    action_type_id: 0,
    action_result_id: 0,
    start_time: "00:00:00",
    end_time: "00:00:00",
  })

  const offenseTeam = () => state.offense === "home" ? state.homePlayers : state.awayPlayers
  const defenseTeam = () => state.offense === "away" ? state.homePlayers : state.awayPlayers

  const offenseTeamId = () => state.offense === "home" ? state.home_team_id : state.away_team_id
  const defenseTeamId = () => state.offense === "away" ? state.home_team_id : state.away_team_id

  React.useEffect(() => {
    GameService.getGame(game_id).then((res) => {
      console.log("game Data", res);
      setState({
        url: res.video_url, 
        home_team_id: res.home_team_id,
        away_team_id: res.away_team_id,
        home_team_name: res.home_team_name, 
        away_team_name: res.away_team_name 
      });
    });

    GameService.getGameTeamPlayers({ game_id }).then((res) => {
      console.log("team players", res)
      setState({ homePlayers: res.home_team, awayPlayers: res.away_team })
    })
  }, [count, game_id])

  React.useEffect(() => {
    if(game_id <= 0) return;
    GameService.getAllTeamTagsByGame(game_id).then(res => 
      setTeamTagList(res)
    )
  }, [game_id, tagCnt])

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const changePlayRate = (flag) => {
    let newRate = flag ? (videoState.playbackRate + 1) : (videoState.playbackRate - 1);
    if (newRate < 0) newRate = 0;
    if (newRate > PLAYBACK_RATE.length - 1) newRate = PLAYBACK_RATE.length - 1;
    setVideoState({ playbackRate: newRate, play: true })
    console.log("rate", PLAYBACK_RATE[newRate])
  }

  const teamClicked = (team) => {
    setState({offense: team})

    setTeamTag({
      start_time: toHHMMSS(`${player.current.getCurrentTime()}`),
    })
  }
  
  const taggingButtonClicked = () => {
    setModalOpen(true)
    setVideoState({ play: false }) 
    
    const curTime = player.current.getCurrentTime()
    setTeamTag({
      game_id,
      offensive_team_id: offenseTeamId(),
      defensive_team_id: defenseTeamId(),
      end_time: toHHMMSS(`${curTime}`),
    })
    setIndTag({
      start_time: toHHMMSS(`${curTime - state.sec_before}`),
      end_time: toHHMMSS(`${curTime + state.sec_after}`),
    })
  }
  
  const saveTeamTag = () => {
    GameService.addTeamTag(teamTag).then(res => {
      console.log("TeamTag", res)
      setModalOpen(false)
      setTagCnt(tagCnt + 1)
    })
  }
  const saveIndTag = () => {
    
  }

  React.useEffect(() => {
    GameService.updateTaggerConfig(config).then(res => {
      console.log("data", res);
      setUser({...getUser(), user_config: {
        sec_before: config.sec_before,
        sec_after: config.sec_after
      }})
    })
  }, [config]);
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
                    onClick={() => {
                        setModalState({ onTarget: target })
                        if(target === "No") {saveIndTag(); saveTeamTag();};
                      }}
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
        <TeamTagTable rows={teamTagList}/>
        <IndividualTagTable rows={indTagList}/>
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
            <div style={{ maxWidth: 1200, margin: 'auto' }} >
              <div className="player-wrapper">
                <ReactPlayer
                  className="react-player"
                  url={state.url}
                  ref={player}
                  onPlay={() => setVideoState({play: true})}
                  onPause={() => setVideoState({play: false})}
                  playing={videoState.play}
                  playbackRate={PLAYBACK_RATE[videoState.playbackRate].rate}
                  controls={true}
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              {[-10, -5, -3, -1].map(t =>
                <ControlButton key={t} onClick={() => seekTo(t)}>
                  {t}s
                </ControlButton>
              )}

              <ControlButton onClick={() => changePlayRate(false)}>
                slow
              </ControlButton>
              {videoState.play ?
                <ControlButton style={{ width: 100 }} startIcon={<PauseCircleOutlineIcon />} onClick={() => setVideoState({ play: false })}>
                  Pause
                </ControlButton>
                :
                <ControlButton style={{ width: 100 }} startIcon={<PlayCircleOutlineIcon />} onClick={() => setVideoState({ play: true })}>
                  Play
                </ControlButton>
              }
              <label style={{ width: "40px" }}>
                {PLAYBACK_RATE[videoState.playbackRate].label}
              </label>
              <ControlButton onClick={() => changePlayRate(true)}>
                fast
              </ControlButton>

              {[1, 3, 5, 10].map(t =>
                <ControlButton key={t} onClick={() => seekTo(t)}>
                  {t}s
                </ControlButton>
              )}
              
            </Box>
          </div>
          <div style={{ display: 'flex' }}>
            <Box sx={{mx:2, textAlign:'center'}}>
              <IconButton sx={{my:1}} onClick={() => setCount(count + 1)}><RefreshIcon/></IconButton><br/>
              <TextField
                label="sec. before"
                sx={{ m: 1, width: 100, }}
                type="number"
                value={config.sec_before}
                onChange={e => setConfig({sec_before: e.target.value})}
                InputProps={{
                  endAdornment: <InputAdornment position="end">s</InputAdornment>,
                }}
              />
              <TextField
                label="sec. after"
                sx={{ m: 1, width: 100, textAlign: "center" }}
                type="number"
                value={config.sec_after}
                onChange={e => setConfig({sec_after: e.target.value})}
                InputProps={{
                  endAdornment: <InputAdornment position="end">s</InputAdornment>,
                }}
              />
            </Box>
            <Box sx={{textAlign:"center", mt:2}}>
              {["home", "away"].map(t => 
              <ControlButton 
                key={t} 
                fullWidth 
                onClick={() => 
                  teamClicked(t)

                } 
                style={{ backgroundColor: t===state.offense ? "#0F0F0F": ""}}
              >
                {state[`${t}_team_name`]}
              </ControlButton>
              )}
              <ControlButton sx={{ mx: "auto", mt: 2 }}>C.P.</ControlButton>
            </Box>
            <Grid container spacing={2} sx={{ textAlign: 'center', mt: 1, mx:2 }}>
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
                <Grid key={i} item xs={6} md={4} onClick={() => taggingButtonClicked()}>
                  <TagButton>{title}</TagButton>
                </Grid>
              ))}
            </Grid>

            <RadioGroup
              sx={{ my: 0, mx: 2 }}
              aria-label="firstsecond"
              name="row-radio-buttons-group"
              value={state.first_second}
              onChange={e => setState({ first_second: e.target.value })}
            >
              <FormControlLabel value="first" control={<Radio />} label="1st half" />
              <FormControlLabel value="second" control={<Radio />} label="2nd half" />
              <FormControlLabel value="overtime" control={<Radio />} label="Overtime" />
            </RadioGroup>
          </div>
        </Box>
      </Main>
    </Box>
  );
}
