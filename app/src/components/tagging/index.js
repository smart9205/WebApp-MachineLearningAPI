import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';

import { useParams } from "react-router-dom";
import VideoPlayer from './videoplayer';
import CryptoJS from 'crypto-js'
import { SECRET } from "../../config/settings"
import GameService from '../../services/game.service';
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

export default function Tagging() {
  const { id } = useParams();

  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    const game_id = CryptoJS.AES.decrypt(id, SECRET).toString(CryptoJS.enc.Utf8)
    console.log("Game id", game_id)
    GameService.getGame(game_id).then((res) => {
      console.log("game Data", res);
      setUrl(res.video_url);
    })

  }, [id])

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
        Hello there!
        here is drawer
      </Drawer>
      <Main open={open}>
        <div style={{width:50}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{height: 50, width: 50, position: 'fixed', zIndex: 999999, top: '45%', border: 2, }}
          >
            {open ? <KeyboardArrowLeftIcon/> : <KeyboardArrowRightIcon/>}
          </IconButton>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <VideoPlayer url={url} />
          <div>
          </div>
        </Box>
      </Main>
    </Box>
  );
}
