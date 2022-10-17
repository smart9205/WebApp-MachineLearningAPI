import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Switch, FormControlLabel, Typography } from '@mui/material';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { toSecond } from '../../../components/utilities';
import gameService from '../../../../../services/game.service';
import GameImage from '../../../../../assets/TeamOverview.png';
import { TEAM_ICON_DEFAULT } from '../../../../../common/staticData';
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
        padding: '0 48px'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function TeamVideoPlayer({ videoData, games, onChangeClip, drawOpen, gameTime }) {
    const handle = useFullScreenHandle();
    const { tagList, autoPlay, idx, videoPlay, cnt = null } = videoData;

    const player = useRef(null);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(false);
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState('');
    const [videoList, setVideoList] = useState([]);
    const [canNext, setCanNext] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        setVideoList([]);
        games.map((game) => {
            if (game.video_url.startsWith('https://www.youtube.com')) {
                gameService.getNewStreamURL(game.video_url).then((res) => {
                    setVideoList((old) => [...old, { id: game.id, url: res }]);
                });
            } else if (game.video_url.toLowerCase() !== 'no video') setVideoList((old) => [...old, { id: game.id, url: game.video_url }]);
        });

        if (videoList.length > 0) setVideoURL(videoList[0].url);
    }, [games]);

    useEffect(() => {
        if (tagList.length === 0) return;

        playTagByIdx(idx);
        console.log('TeamVideo => ', curIdx, videoURL, videoList);
        setCurIdx(idx);

        setPlay(videoPlay);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, idx, videoPlay, ready, cnt]);

    useEffect(() => {
        if (autoPlay) onChangeClip(curIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx]);

    const seekTo = (sec) => player.current && player.current.seekTo(sec);

    const playTagByIdx = (i) => {
        const video = videoList.filter((item) => item.id === tagList[i].game_id)[0].url;
        console.log(videoURL, video);

        if (video !== videoURL) setVideoURL(video);

        seekTo(toSecond(tagList[i]?.team_tag_start_time));
    };

    const onProgress = (current) => {
        const startTime = toSecond(tagList[curIdx]?.team_tag_start_time);
        const endTime = toSecond(tagList[curIdx]?.team_tag_end_time);

        setCurrentTime(current);

        if (current < startTime) {
            seekTo(startTime);
        }

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
                                width="100%"
                                height="100%"
                            />
                        )}
                        {tagList.length === 0 && <img src={GameImage} style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'absolute', left: 0, top: 0 }} />}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', width: '100%', position: 'absolute', minWidth: '300px', left: 0, top: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'blue', width: '150px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'white' }}>{`${gameTime.period} - ${gameTime.time}'`}</Typography>
                    </div>
                    <img src={gameTime.home_team_image ? gameTime.home_team_image : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', width: '150px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 500, color: 'blue' }}>
                            {`${gameTime.home_team_goals} : ${gameTime.away_team_goals}`}
                        </Typography>
                    </div>
                    <img src={gameTime.away_team_image ? gameTime.away_team_image : TEAM_ICON_DEFAULT} style={{ width: '56px', height: '56px' }} />
                </div>

                <div style={styles.buttonBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>{getTime()}</Typography>
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
                    {handle.active && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 12px', background: '#80808069' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>
                                {`${tagList[curIdx].player_names} - ${tagList[curIdx].action_names} - ${tagList[curIdx].action_type_names} - ${tagList[curIdx].action_result_names}`}
                            </Typography>
                        </div>
                    )}
                </div>
            </FullScreen>
        </div>
    );
}
