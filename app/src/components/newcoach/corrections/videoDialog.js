import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactPlayer from 'react-player';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Button, IconButton } from '@mui/material';
import { toSecond } from '../components/utilities';

const CorrectionsVideoPlayer = ({ onClose, video_url, start, end }) => {
    const handle = useFullScreenHandle();
    const player = useRef(null);
    const [playRate, setPlayRate] = useState(1);
    const [play, setPlay] = useState(true);

    const onProgress = (seconds) => {
        if (seconds >= toSecond(end)) {
            setPlay(false);
            onClose();
        } else if (seconds <= toSecond(start)) {
            if (playRate !== 1) {
                setPlay(false);
                setPlayRate(1);
            }
        }
    };

    useEffect(() => {
        player.current && player.current.seekTo(toSecond(start));
    }, [video_url, start]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
        >
            <div style={{ width: '80%', margin: 'auto', position: 'relative' }}>
                <FullScreen handle={handle}>
                    <div style={{ width: '100%', margin: 'auto' }}>
                        <div className="player-wrapper">
                            <ReactPlayer
                                className="react-player"
                                url={video_url}
                                ref={player}
                                onPlay={() => setPlay(true)}
                                onPause={() => setPlay(false)}
                                onProgress={(p) => onProgress(p.playedSeconds)}
                                playing={play}
                                controls={false}
                                playbackRate={playRate}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </div>
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', position: 'absolute', cursor: 'pointer', padding: '0 16px', top: '12px' }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, bottom: '16px', justifyContent: 'center', width: '100%', gap: '1rem' }}>
                        <Button variant="outlined" sx={{ width: '60px', color: 'white' }} onClick={() => setPlayRate(0.5)}>
                            Slow
                        </Button>
                        <IconButton
                            onClick={() => {
                                if (playRate === 1) setPlay((p) => !p);
                                else setPlayRate(1);
                            }}
                            style={{ color: 'white', backgroundColor: '#80808069' }}
                        >
                            {play && playRate === 1 ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>
                        <Button variant="outlined" sx={{ width: '60px', color: 'white' }} onClick={() => setPlayRate((s) => s + 0.5)}>
                            Fast
                        </Button>
                    </div>
                </FullScreen>
            </div>
        </div>
    );
};

export default CorrectionsVideoPlayer;
