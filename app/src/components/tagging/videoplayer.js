import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';

export default function VideoPlayer({url}) {
  return (
    <div>
      <ReactPlayer
        url={url}
        playing={true}
        // controls={true}
        width='100%'
        height='100%'
      />
      <Box sx={{ flexGrow: 1 }}>
        <Button variant="outlined" startIcon={<PlayCircleOutlineIcon />}>
          Play
        </Button>
        {/* <Button variant="outlined" startIcon={<PauseCircleOutlineIcon />}>
							Pause
						</Button> */}
        <Button variant="outlined" >
          -10s
        </Button>
        <Button variant="outlined" >
          -5s
        </Button>
        <Button variant="outlined" >
          -3s
        </Button>
        <Button variant="outlined" >
          -1s
        </Button>
        <Button variant="outlined" >
          +1s
        </Button>
        <Button variant="outlined" >
          +3s
        </Button>
        <Button variant="outlined" >
          +5s
        </Button>
        <Button variant="outlined" >
          +10s
        </Button>
      </Box>
    </div>
  );
}
