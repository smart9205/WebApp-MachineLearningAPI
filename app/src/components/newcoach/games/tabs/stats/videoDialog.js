import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactPlayer from 'react-player';
import { Button, IconButton, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';

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

        if (seconds >= end) {
            if (currentIndex < tagList.length - 1) PlayVideo(1);
            else {
                setPlay(false);
                onClose();
            }
        } else if (seconds <= start) {
            if (playRate !== 1) {
                setPlay(false);
                setPlayRate(1);
            }

            player.current.seekTo(start);
            setPlay(true);
        }
    };

    const PlayVideo = (add) => {
        const index = currentIndex + add;

        if (index >= tagList.length) {
            setPlay(false);
            onClose();

            return;
        } else if (index < 0) index = 0;

        setCurrentIndex(index);
        player.current.seekTo(toSecond(tagList[index].start_time));
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
                            cursor: 'pointer',
                            color:'red'
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, bottom: '16px', justifyContent: 'space-between', width: '100%', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <IconButton onClick={() => PlayVideo(-1)} style={{ color: 'white', backgroundColor: '#80808069' }}>
                                <SkipPreviousSharpIcon color="white" />
                            </IconButton>
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
                            <IconButton onClick={() => PlayVideo(1)} style={{ color: 'white', backgroundColor: '#80808069' }}>
                                <SkipNextSharpIcon />
                            </IconButton>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 12px', background: '#80808069' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>
                                {`${tagList[currentIndex].player_name}, ${tagList[currentIndex].action_name}, ${tagList[currentIndex].action_type}, ${tagList[currentIndex].action_result}`}
                            </Typography>
                        </div>
                    </div>
                </FullScreen>
            </div>
        </div>
    );
};

export default GameStatsVideoPlayer;
