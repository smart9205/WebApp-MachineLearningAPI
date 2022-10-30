import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactPlayer from 'react-player';
import { Button, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { toSecond } from '../../../components/utilities';
import gameService from '../../../../../services/game.service';

const GameStatsVideoPlayer = ({ onClose, video_url, tagList }) => {
    const handle = useFullScreenHandle();
    const player = useRef(null);
    const [playRate, setPlayRate] = useState(1);
    const [play, setPlay] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoURL, setVideoURL] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const fastVideo = (param) => {
        player.current && player.current.seekTo(currentTime + param);
    };

    const onProgress = (seconds) => {
        setCurrentTime(seconds);

        const start = toSecond(tagList[currentIndex].start_time);
        const end = toSecond(tagList[currentIndex].end_time);

        if (seconds >= toSecond(end)) {
            if (currentIndex < tagList.length - 1) {
                const next = currentIndex + 1;

                setCurrentIndex(next);
                player.current.seekTo(toSecond(tagList[next].start_time));
            } else {
                setPlay(false);
                onClose();
            }
        } else if (seconds <= toSecond(start)) {
            if (playRate !== 1) {
                setPlay(false);
                setPlayRate(1);
            }

            player.current.seekTo(toSecond(tagList[currentIndex].start_time));
            setPlay(true);
        }
    };

    useEffect(() => {
        if (video_url.startsWith('https://www.youtube.com')) {
            gameService.getNewStreamURL(video_url).then((res) => {
                setVideoURL(res.url);
            });
        } else if (video_url.toLowerCase() !== 'no video') setVideoURL(video_url);
    }, [video_url]);

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
                                url={videoURL}
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
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            position: 'absolute',
                            padding: '0 16px',
                            top: '12px',
                            justifyContent: 'flex-end',
                            cursor: 'pointer'
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, bottom: '16px', justifyContent: 'center', width: '100%', gap: '1rem' }}>
                        <IconButton style={{ color: 'white', backgroundColor: '#80808069' }} onClick={() => fastVideo(-3)}>
                            <FastRewindIcon color="white" />
                        </IconButton>
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
                        <IconButton style={{ color: 'white', backgroundColor: '#80808069' }} onClick={() => fastVideo(3)}>
                            <FastForwardIcon color="white" />
                        </IconButton>
                    </div>
                </FullScreen>
            </div>
        </div>
    );
};

export default GameStatsVideoPlayer;
