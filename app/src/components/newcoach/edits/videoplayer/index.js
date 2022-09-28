import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Switch, FormControlLabel } from '@mui/material';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { toSecond } from '../../components/utilities';
import gameService from '../../../../services/game.service';
import GameImage from '../../../../assets/MyEdits.png';
// import VIDEO from '../../assets/1.mp4'

const styles = {
    action: {
        position: 'absolute',
        left: '3%',
        bottom: 10,
        zIndex: 100,
        color: 'white',
        fontSize: 14,
        display: 'flex',
        width: '50%'
    },
    buttonBox: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        paddingLeft: '11%',
        minWidth: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: '1rem'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function EditVideoPlayer({ videoData, tagList, onChangeClip, drawOpen }) {
    const handle = useFullScreenHandle();
    const { autoPlay, idx, videoPlay, cnt = null } = videoData;

    const player = useRef(null);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(false);
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState('');
    const [videoList, setVideoList] = useState([]);
    const [canNext, setCanNext] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);

    const seekTo = (sec) => player.current && player.current.seekTo(sec);

    const playTagByIdx = (i) => {
        const video = videoList.filter((item) => item.id === tagList[i].game_id).map((item) => item.url)[0];

        if (video !== videoURL) setVideoURL(video);

        seekTo(toSecond(tagList[i]?.start_time));
    };

    const onProgress = (current) => {
        setCurrentTime(current);

        const startTime = toSecond(tagList[curIdx]?.start_time);
        const endTime = toSecond(tagList[curIdx]?.end_time);

        if (current < startTime) seekTo(startTime);

        if (current > endTime) {
            if (curIdx < tagList.length - 1) {
                if (canNext) {
                    const video = videoList.filter((item) => item.id === tagList[curIdx + 1].game_id).map((item) => item.url)[0];

                    if (video !== videoURL) setVideoURL(video);

                    setCurIdx((c) => c + 1);
                } else setPlay(false);
            } else PlayVideo(1);
        }
    };

    const PlayVideo = (num) => {
        let index;
        if (curIdx + num >= tagList.length) {
            index = 0;
        } else if (curIdx + num < 0) {
            index = tagList.length - 1;
        } else index = curIdx + num;

        playTagByIdx(index);
        setPlay(true);
        setCurIdx(index);
    };

    const fastVideo = (param) => {
        if (currentTime + param < 0) seekTo(0);
        else seekTo(currentTime + param);
    };

    const handlePause = () => {
        setPlay(false);
    };

    const handlePlay = () => {
        setPlay(true);
    };

    useEffect(() => {
        setVideoList([]);
        setCurIdx(0);
        setVideoURL('');
        tagList.map((tag, index) => {
            if (tag.video_url.startsWith('https://www.youtube.com')) {
                gameService.getNewStreamURL(tag.video_url).then((res) => {
                    setVideoList((old) => [...old, { id: tag.game_id, url: res }]);

                    if (index === 0) setVideoURL(res);
                });
            } else {
                setVideoList((old) => [...old, { id: tag.game_id, url: tag.video_url }]);

                if (index === 0) setVideoURL(tag.video_url);
            }
        });
    }, [tagList]);

    useEffect(() => {
        if (!ready) return;

        if (tagList.length === 0) {
            setVideoURL('');
            setCurIdx(0);

            return;
        }

        playTagByIdx(idx);
        setCurIdx(idx);

        setPlay(videoPlay);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx, videoPlay, ready, cnt]);

    useEffect(() => {
        if (autoPlay) onChangeClip(curIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <div style={{ width: '100%', margin: 'auto', minWidth: 500, position: 'relative' }}>
                <FullScreen handle={handle}>
                    <div style={{ width: drawOpen ? '100%' : '80%', margin: 'auto' }}>
                        <div className="player-wrapper">
                            {videoURL !== '' && (
                                <ReactPlayer
                                    className="react-player"
                                    url={videoURL}
                                    // url={VIDEO}
                                    ref={player}
                                    onPlay={handlePlay}
                                    onPause={handlePause}
                                    onReady={() => setReady(true)}
                                    onProgress={(p) => onProgress(p.playedSeconds)}
                                    playing={play}
                                    controls={false}
                                    width="100%"
                                    height="100%"
                                />
                            )}
                            {videoURL === '' && <img src={GameImage} style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'absolute', left: 0, top: 0 }} />}
                        </div>
                    </div>

                    <div style={styles.buttonBox}>
                        <IconButton onClick={() => PlayVideo(-1)} style={styles.button}>
                            <SkipPreviousSharpIcon color="white" />
                        </IconButton>
                        <IconButton style={styles.button} onClick={() => fastVideo(-3)}>
                            <FastRewindIcon color="white" />
                        </IconButton>

                        <IconButton onClick={() => setPlay((p) => !p)} style={styles.button}>
                            {play ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>

                        <IconButton style={styles.button} onClick={() => fastVideo(3)}>
                            <FastForwardIcon color="white" />
                        </IconButton>
                        <IconButton onClick={() => PlayVideo(1)} style={styles.button}>
                            <SkipNextSharpIcon />
                        </IconButton>

                        {autoPlay && <FormControlLabel control={<Switch checked={canNext} onChange={(e) => setCanNext(e.target.checked)} />} label="Auto Play" sx={{ color: 'white' }} />}

                        <IconButton onClick={handle.active ? handle.exit : handle.enter} style={styles.button}>
                            {handle.active ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </div>
                </FullScreen>
            </div>
        </div>
    );
}
