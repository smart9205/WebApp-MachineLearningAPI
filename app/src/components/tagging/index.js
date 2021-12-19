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
import VideoPlayer from './videoplayer';
import GameService from '../../services/game.service';
import TagTable from "./tagTable"
import { Button } from '@mui/material';
const drawerWidth = "30%";

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

  const [url, setUrl] = React.useState("");
  const [homePlayerList, setHomePlayerList] = React.useState([]);
  const [awayPlayerList, setAwayPlayerList] = React.useState([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});

  React.useEffect(() => {
    const game_id = atob(id).slice(3, 5)
    console.log("Game id", game_id)
    GameService.getGame(game_id).then((res) => {
      console.log("game Data", res);
      setUrl(res.video_url);
    });

    GameService.getGameTeamPlayers({ game_id, home: true }).then((res) => {
      console.log("team players", res)
      setHomePlayerList(res);
    })
    GameService.getGameTeamPlayers({ game_id, home: false }).then((res) => {
      console.log("team players", res)
      setAwayPlayerList(res);
    })
  }, [id])

  const [open, setOpen] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

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
                homePlayerList.map(player => (
                  <ListItemButton
                    selected={selectedPlayer === player}
                    onClick={() => setSelectedPlayer(player)}
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
                [
                  "Right",
                  "Left",
                  "Header"
                ].map(player => (
                  <ListItemButton>
                    <ListItemText primary={player} />
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
                [
                  "Yes",
                  "No"
                ].map(player => (
                  <ListItemButton>
                    <ListItemText primary={player} />
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
                  Goal
                </ListSubheader>
              }
            >
              {
                [
                  "Yes",
                  "No"
                ].map(player => (
                  <ListItemButton>
                    <ListItemText primary={player} />
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
                  Assist
                </ListSubheader>
              }
            >
              {
                homePlayerList.map(player => (
                  <ListItemButton
                    selected={selectedPlayer === player}
                    onClick={() => setSelectedPlayer(player)}
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
                  Assist
                </ListSubheader>
              }
            >
              {
                awayPlayerList.map(player => (
                  <ListItemButton
                    // selected={selectedPlayer === player}
                    // onClick={() => setSelectedPlayer(player)}
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
        <Box sx={{ flexGrow: 1 }}>
          <VideoPlayer url={url} />
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
            ].map(title => (
              <Grid item xs={6} md={3} onClick={() => setModalOpen(true)}>
                <TagButton>{title}</TagButton>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Main>
    </Box>
  );
}
