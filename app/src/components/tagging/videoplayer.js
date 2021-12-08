import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';

export default function Tagging() {
  return (
    <div>
      <ReactPlayer
        url='https://d25i0exly9qfnd.cloudfront.net/games/2021/SUMMER 2021 - Friendly Games (Club) - 2021-10-01 - Ironi Naharia vs Team A_211002150439.mp4'
        // playing={true}
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
