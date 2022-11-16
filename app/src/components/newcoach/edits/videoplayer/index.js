import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Switch, FormControlLabel, Typography, Button } from '@mui/material';
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
import { getPeriod } from '../../games/tabs/overview/tagListItem';
import { TEAM_ICON_DEFAULT } from '../../../../common/staticData';
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
        padding: '0 20px',
        width: '100%'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function EditVideoPlayer({ idx, tagList, onChangeClip, drawOpen }) {
    const handle = useFullScreenHandle();

    const player = useRef(null);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(false);
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState('');
    const [videoList, setVideoList] = useState([]);
    const [canNext, setCanNext] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [fullMode, setFullMode] = useState(false);
    const [playRate, setPlayRate] = useState(1);
    const [showLogo, setShowLogo] = useState(true);

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
        if (tagList.length === 0) {
            setVideoURL('');
            setCurIdx(0);

            return;
        }

        playTagByIdx(idx);
        setCurIdx(idx);
        setPlay(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    useEffect(() => {
        if (idx !== curIdx) onChangeClip(curIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx]);

    const fullscreenChange = useCallback(
        (state, h) => {
            if (handle === h) setFullMode(state);
        },
        [handle]
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <div style={{ width: '100%', margin: 'auto', minWidth: 500, position: 'relative' }}>
                <FullScreen handle={handle} onChange={fullscreenChange}>
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
                                    playbackRate={playRate}
                                    width="100%"
                                    height="100%"
                                />
                            )}
                            {videoURL === '' && <img src={GameImage} style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'absolute', left: 0, top: 0 }} />}
                        </div>
                    </div>
                    <div style={{ position: 'absolute', left: '36px', top: '12px', width: '90%', display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel control={<Switch checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />} label="" sx={{ color: 'white', margin: 0, flex: 1 }} />
                        {showLogo && tagList.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flex: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'blue', width: '150px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'white' }}>
                                        {`${getPeriod(tagList[curIdx]?.period)} - ${tagList[curIdx]?.time_in_game}'`}
                                    </Typography>
                                </div>
                                <>
                                    <img src={tagList[curIdx]?.home_team_logo ? tagList[curIdx]?.home_team_logo : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', width: '90px' }}>
                                        <Typography
                                            sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'blue' }}
                                        >{`${tagList[curIdx]?.home_team_goal} : ${tagList[curIdx]?.away_team_goal}`}</Typography>
                                    </div>
                                    <img src={tagList[curIdx]?.away_team_logo ? tagList[curIdx]?.away_team_logo : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                                </>
                            </div>
                        )}
                    </div>

                    <div style={styles.buttonBox}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

                            <FormControlLabel control={<Switch checked={canNext} onChange={(e) => setCanNext(e.target.checked)} />} label="AP" sx={{ color: 'white' }} />
                            <IconButton onClick={handle.active ? handle.exit : handle.enter} style={styles.button}>
                                {handle.active ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </div>
                        {fullMode && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 12px', background: '#80808069' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>{tagList[curIdx].clip_name}</Typography>
                            </div>
                        )}
                    </div>
                </FullScreen>
            </div>
        </div>
    );
}
