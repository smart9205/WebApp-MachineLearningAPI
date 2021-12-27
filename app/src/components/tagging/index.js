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
  const [playerTagList, setPlayerTagList] = React.useState([])
  const [tagCnt, setTagCnt] = React.useState(0)
  
  const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    url: "",
    offense: "home",
    first_second: "first",
    start_time: "00:00:00",
    home_team_name: "",
    away_team_name: "",
    homePlayers: [],
    awayPlayers: [],
    offensePlayer: {},
    assistPlayer: {},
    savedPlayer: {},
    goal: "No",
  })

  const [config, setConfig] = React.useReducer((old, action) => ({ ...old, ...action }), {
    sec_before: getUser()?.user_config ? getUser()?.user_config.sec_before : 3,
    sec_after: getUser()?.user_config ? getUser()?.user_config.sec_after : 10,
  })

  const [videoState, setVideoState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    play: false,
    playbackRate: 3
  })

  const [teamTag, setTeamTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
    id: 0,
    game_id,
    offensive_team_id: 0,
    defensive_team_id: 0,
    start_time: "00:00:00",
    end_time: "00:00:00",
  })
  const [playerTag, setPlayerTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
    team_tag_id: 0,
    team_id: 0,
    player_id: 0,
    action_id: 0,
    action_type_id: 1,
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

  const updateTagList = () => {
    setTagCnt(tagCnt + 1)
  }

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

  const teamClicked = async (team) => {
    const st = toHHMMSS(`${player.current.getCurrentTime()}`)
    await setState({offense: team, start_time: st})

    setTeamTag({
      game_id,
      start_time: st,
      offensive_team_id: offenseTeamId(),
      defensive_team_id: defenseTeamId(),
    })
  }
  
  const taggingButtonClicked = (action) => {
    setModalOpen(true)
    setVideoState({ play: false }) 
    
    const curTime = player.current.getCurrentTime()
    setTeamTag({
      end_time: toHHMMSS(`${curTime + state.sec_after}`),
    })
    setPlayerTag({
      team_id: offenseTeamId(),
      action_id: action.id,
      start_time: toHHMMSS(`${curTime - state.sec_before}`),
      end_time: toHHMMSS(`${curTime + state.sec_after}`),
    })
  }
  
  const saveTeamTag = async () => {
    try {
      const res = await GameService.addTeamTag(teamTag)
      setModalOpen(false)
      setTeamTag({id: res.id})
      setTagCnt(tagCnt + 1)
      return res;
    } catch(e) {}
  }
  const savePlayerTag = (PTag) => {
    GameService.addPlayerTag(PTag).then(res => {
      console.log("playerTag", res)
    })
  }

  const targetClicked = async (target) => {
    await setPlayerTag({ action_result_id: target.id })
    if(target.name === "No") { 
      const t = await saveTeamTag(); 
      await setPlayerTag({
        team_tag_id: t.id,
      })
      if(!state.offensePlayer?.id) return
      savePlayerTag({...playerTag, player_id: state.offensePlayer.id}); 
    };
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
                    selected={state.offensePlayer === player}
                    onClick={() => setState({ offensePlayer: player })}
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
              subheader={<ListSubheader component="div" id="nested-list-subheader">Type</ListSubheader>}
            >
              {[
                {id: 1, name: "Right"},
                {id: 2, name: "Left"},
                {id: 3, name: "Header"}
              ].map((type, i) => (
                <ListItemButton key={i}
                  selected={playerTag.action_type_id === type.id}
                  onClick={() => setPlayerTag({ action_type_id: type.id })}
                >
                  <ListItemText primary={type.name} />
                </ListItemButton>
              ))}
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
                [
                  {id: 1, name:"Yes"}, 
                  {id: 2, name:"No"}
                ].map((target, i) => (
                  <ListItemButton key={i}
                    selected={playerTag.action_result_id === target.id}
                    onClick={() => targetClicked(target)}
                  >
                    <ListItemText primary={target.name} />
                  </ListItemButton>
                ))
              }
            </List>
          </SubBox>
          {
            state.onTarget === "Yes" &&
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
                      selected={state.goal === goal}
                      onClick={() => setState({ goal })}
                    >
                      <ListItemText primary={goal} />
                    </ListItemButton>
                  ))
                }
              </List>
            </SubBox>
          }
          {
            state.onTarget === "Yes" && state.goal === "Yes" &&
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
                    <ListItemButton key={i} selected={state.assistPlayer === player}
                      onClick={() => setState({ assistPlayer: player })}
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
                    selected={state.savedPlayer === player}
                    onClick={() => setState({ savedPlayer: player })}
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
        <TeamTagTable rows={teamTagList} updateTagList={updateTagList}/>
        <IndividualTagTable rows={playerTagList}/>
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

              {[-10, -5, -3, -1].map(t =><ControlButton key={t} onClick={() => seekTo(t)}>{t}s</ControlButton>)}
              
              <ControlButton onClick={() => changePlayRate(false)}>slow</ControlButton>
              
              {videoState.play ?
                <ControlButton style={{ width: 100 }} startIcon={<PauseCircleOutlineIcon />} onClick={() => setVideoState({ play: false })}>
                  Pause
                </ControlButton>
                :
                <ControlButton style={{ width: 100 }} startIcon={<PlayCircleOutlineIcon />} onClick={() => setVideoState({ play: true })}>
                  Play
                </ControlButton>
              }
              
              <label style={{ width: "40px" }}>{PLAYBACK_RATE[videoState.playbackRate].label}</label>
              
              <ControlButton onClick={() => changePlayRate(true)}>fast</ControlButton>

              {[1, 3, 5, 10].map(t =><ControlButton key={t} onClick={() => seekTo(t)}>{t}s</ControlButton>)}
            </Box>
          </div>
          <div style={{ display: 'flex' }}>
            <Box sx={{mx:2, textAlign:'center'}}>
              <IconButton sx={{my:1}} onClick={() => setCount(count + 1)}><RefreshIcon/></IconButton><br/>
              <TextField
                label="sec. before"
                sx={{ m: 1, width: 100 }}
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                type="number"
                value={config.sec_before}
                onChange={e => setConfig({sec_before: e.target.value})}
              />
              <TextField
                label="sec. after"
                sx={{ m: 1, width: 100 }}
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                type="number"
                value={config.sec_after}
                onChange={e => setConfig({sec_after: e.target.value})}
              />
            </Box>
            <Box sx={{textAlign:"center", mt:2}}>
              {["home", "away"].map(t => 
              <ControlButton 
                key={t} 
                fullWidth 
                style={{  backgroundColor: t===state.offense && "darkblue", color: t===state.offense && "white"}}
                onClick={() => 
                  teamClicked(t)
                } 
              >
                {state[`${t}_team_name`]}
              </ControlButton>
              )}
              <Box style={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                Start Time : {state.start_time} <ControlButton sx={{mr: 0}} >C.P.</ControlButton>
              </Box>
            </Box>
            
            <Grid container spacing={2} sx={{ textAlign: 'center', mt: 1, mx:2 }}>
              {[
                {id: 2, title:"Short Pass"},
                {id: 2, title:"Pass"},
                {id: 6, title:"Free Kick"},
                {id: 1, title:"Shot"},
                {id: 3, title:"Cross"},
                {id: 4, title:"Penality"},
                {id: 5, title:"Corner"},
                {id: 7, title:"Dribble"},
                {id: 8, title:"Foul"},
              ].map((action, i) => (
                <Grid key={i} item xs={6} md={4} onClick={() => taggingButtonClicked(action)}>
                  <TagButton>{action.title}</TagButton>
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
