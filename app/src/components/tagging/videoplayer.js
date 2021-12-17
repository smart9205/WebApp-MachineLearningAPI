import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url }) {
  const [play, setPlay] = React.useState(false)
  const player = React.useRef(null);

  const seekTo = (sec) => {
    player.current.seekTo(player.current.getCurrentTime() + sec)
  } 

  return (
    <div width='100%' height='100%'>
      <ReactPlayer
        url={url}
        ref={player}
        playing={play}
        // controls={true}
        width='100%'
        height='100%'
      />
      <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
        {play ?
          <Button variant="outlined" sx={{width:100}} startIcon={<PauseCircleOutlineIcon />} onClick={() => setPlay(false)}>
            Pause
          </Button>
          :
          <Button variant="outlined" sx={{width:100}} startIcon={<PlayCircleOutlineIcon />} onClick={() => setPlay(true)}>
            Play
          </Button>
        }
        <Button variant="outlined" onClick={() => seekTo(-10)}>
          -10s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(-5)}>
          -5s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(-3)}>
          -3s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(-1)}>
          -1s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(1)}>
          +1s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(3)}>
          +3s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(5)}>
          +5s
        </Button>
        <Button variant="outlined" onClick={() => seekTo(10)}>
          +10s
        </Button>
      </Box>
    </div>
  );
}
