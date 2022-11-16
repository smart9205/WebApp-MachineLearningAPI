import React, { useRef, useState, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactPlayer from 'react-player';
import { IconButton, Switch, FormControlLabel, Typography, Button } from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { toSecond } from '../components/utilities';
import gameService from '../../../services/game.service';
import GameImage from '../../../assets/Game.png';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function GameVideoPlayer({ videoData, game, onChangeClip, drawOpen }) {
    const handle = useFullScreenHandle();
    const { tagList, autoPlay, idx, click, videoPlay, cnt = null } = videoData;

    const player = useRef(null);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(false);
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState('');
    const [canNext, setCanNext] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [playRate, setPlayRate] = useState(1);
    const [showLogo, setShowLogo] = useState(true);

    useEffect(() => {
        if (game?.video_url.startsWith('https://www.youtube.com')) {
            gameService.getNewStreamURL(game?.video_url).then((res) => {
                setVideoURL(res.url);
            });
        } else if (game.video_url.toLowerCase() !== 'no video') setVideoURL(game?.video_url);
    }, [game?.video_url]);

    useEffect(() => {
        if (!ready) return;

        if (!tagList.length) return;

        playTagByIdx(idx);
        setCurIdx(idx);

        setPlay(videoPlay);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, idx, videoPlay, ready, cnt, click]);

    useEffect(() => {
        if (autoPlay) onChangeClip(curIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx]);

    const seekTo = (sec) => player.current && player.current.seekTo(sec);

    const playTagByIdx = (i) => seekTo(toSecond(tagList[i]?.start_time));

    const onProgress = (current) => {
        const startTime = toSecond(tagList[curIdx]?.start_time);
        const endTime = toSecond(tagList[curIdx]?.end_time);

        setCurrentTime(current);

        if (current < startTime) {
            seekTo(startTime);
        }

        if (current > endTime) {
            if (tagList.length - 1 <= curIdx) {
                // last tag
                PlayVideo(0);
            } else if (canNext) {
                // is auto play, next clip
                setCurIdx((c) => c + 1);
            } else {
                setPlay(false);
            }
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
        seekTo(currentTime + param);
    };

    const handlePause = () => {
        setPlay(false);
    };

    const handlePlay = () => {
        setPlay(true);
    };

    const getTime = () => {
        let hour = Math.floor(currentTime / 3600);
        let minute = Math.floor((currentTime - hour * 3600) / 60);
        let second = Math.floor(currentTime - hour * 3600 - minute * 60);

        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;

        return hour + ':' + minute + ':' + second;
    };

    console.log('gamevideo => ', curIdx);

    return (
        <div style={{ width: '100%', margin: 'auto', minWidth: 500, position: 'relative' }}>
            <FullScreen handle={handle}>
                <div style={{ width: drawOpen ? '100%' : '80%', margin: 'auto' }}>
                    <div className="player-wrapper">
                        {tagList.length > 0 && (
                            <ReactPlayer
                                className="react-player"
                                url={tagList.length > 0 ? videoURL : ''}
                                // url={VIDEO}
                                ref={player}
                                onPlay={handlePlay}
                                onPause={handlePause}
                                onReady={() => setReady(true)}
                                onProgress={(p) => onProgress(p.playedSeconds)}
                                playing={play}
                                controls={false}
                                playbackRate={playRate}
                                width="100%"
                                height="100%"
                            />
                        )}
                        {tagList.length === 0 && <img src={GameImage} style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'absolute', left: 0, top: 0 }} />}
                    </div>
                </div>
                <div style={{ position: 'absolute', left: '36px', top: '12px', display: 'flex', alignItems: 'center', width: '90%' }}>
                    <FormControlLabel control={<Switch checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />} label="" sx={{ color: 'white', margin: 0, flex: 1 }} />
                    {showLogo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flex: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'blue', width: '150px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'white' }}>{`${game.period} - ${game.time}'`}</Typography>
                            </div>
                            {game.home_team_goals !== undefined && (
                                <>
                                    <img src={game.home_team_image ? game.home_team_image : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', width: '90px' }}>
                                        <Typography
                                            sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'blue' }}
                                        >{`${game.home_team_goals} : ${game.away_team_goals}`}</Typography>
                                    </div>
                                    <img src={game.away_team_image ? game.away_team_image : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div style={styles.buttonBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>{getTime()}</Typography>
                        <IconButton onClick={() => PlayVideo(-1)} style={styles.button}>
                            <SkipPreviousSharpIcon color="white" />
                        </IconButton>

                        <IconButton style={styles.button} onClick={() => fastVideo(-3)}>
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
                            {play && playRate === 1 ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <Button variant="outlined" sx={{ width: '60px', color: 'white' }} onClick={() => setPlayRate((s) => s + 0.5)}>
                            Fast
                        </Button>
                        <IconButton style={styles.button} onClick={() => fastVideo(3)}>
                            <FastForwardIcon color="white" />
                        </IconButton>

                        <IconButton onClick={() => PlayVideo(1)} style={styles.button}>
                            <SkipNextSharpIcon />
                        </IconButton>

                        {autoPlay && <FormControlLabel control={<Switch defaultChecked onChange={(e) => setCanNext(e.target.checked)} />} label="AP" sx={{ color: 'white' }} />}
                        <IconButton onClick={handle.active ? handle.exit : handle.enter} style={styles.button}>
                            {handle.active ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </div>
                    {handle.active && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 12px', background: '#80808069' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>{tagList[curIdx].name}</Typography>
                        </div>
                    )}
                </div>
            </FullScreen>
        </div>
    );
}
