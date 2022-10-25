import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactPlayer from 'react-player';
import { IconButton } from '@mui/material';

import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import CloseIcon from '@mui/icons-material/CloseOutlined';

import gameService from '../../services/game.service';

const FullVideoPlayer = ({ video_url }) => {
    const handle = useFullScreenHandle();
    const player = useRef(null);
    const [play, setPlay] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoURL, setVideoURL] = useState('');

    const fastVideo = (param) => {
        player.current && player.current.seekTo(currentTime + param);
    };

    const onProgress = (seconds) => {
        setCurrentTime(seconds);
    };

    useEffect(() => {
        if (video_url?.startsWith('https://www.youtube.com') || video_url?.startsWith('https://youtu.be')) {
            gameService.getNewStreamURL(video_url).then((res) => {
                setVideoURL(res.url);
            });
        } else setVideoURL(video_url);
    }, [video_url]);

    return (
        <>
            <div className="player-wrapper tag-video">
                <ReactPlayer
                    className="react-player"
                    url={videoURL}
                    ref={player}
                    onPlay={() => setPlay(true)}
                    onPause={() => setPlay(false)}
                    onProgress={(p) => onProgress(p.playedSeconds)}
                    playing={play}
                    controls={true}
                    width="100%"
                    height="100%"
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, bottom: '16px', justifyContent: 'center', width: '100%', gap: '1rem' }}>
                <IconButton style={{ color: 'white', backgroundColor: '#80808069' }} onClick={() => fastVideo(-5)}>
                    <FastRewindIcon color="white" />
                </IconButton>
                <IconButton style={{ color: 'white', backgroundColor: '#80808069' }} onClick={() => fastVideo(5)}>
                    <FastForwardIcon color="white" />
                </IconButton>
            </div>
        </>
    );
};

export default FullVideoPlayer;
