import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';

const ControlButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
  color: ${props => props.color};
  margin: 6px
`;

export default function VideoPlayer({ url }) {
  const [play, setPlay] = React.useState(false)
  const player = React.useRef(null);

  const seekTo = (sec) => {
    player.current.seekTo(player.current.getCurrentTime() + sec)
  } 

  return (
    <div>
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
          <ControlButton style={{width:100}} startIcon={<PauseCircleOutlineIcon />} onClick={() => setPlay(false)}>
            Pause
          </ControlButton>
          :
          <ControlButton style={{width:100}} startIcon={<PlayCircleOutlineIcon />} onClick={() => setPlay(true)}>
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
  );
}
