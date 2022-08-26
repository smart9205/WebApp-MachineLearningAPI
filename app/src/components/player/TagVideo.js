import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import { toSecond } from '../../common/utilities';
import gameService from '../../services/game.service';
// import VIDEO from '../../assets/1.mp4'

const styles = {
    action: {
        color: 'white',
        fontSize: 14,
        display: 'flex',
        width: '50%'
    },
    buttonBox: {
        width: '45%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    actionControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        margin: 'auto'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function TagVideo({ tagList, url, muteState, setOpen }) {
    const player = useRef(null);
    const [play, setPlay] = useState(true);
    const [ready, setReady] = useState(false);
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState('');

    useEffect(() => {
        if (url?.startsWith('https://www.youtube.com') || url?.startsWith('https://youtu.be')) {
            gameService.getNewStreamURL(url).then((res) => {
                setVideoURL(res.url);
            });
        } else setVideoURL(url);
    }, [url]);

    useEffect(() => {
        if (!ready) return;

        if (!tagList.length) return;

        playTagByIdx(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, ready]);

    const seekTo = (sec) => player.current.seekTo(sec);

    const playTagByIdx = (i) => seekTo(toSecond(tagList[i]?.start_time));

    const onProgress = (currentTime) => {
        const startTime = toSecond(tagList[curIdx]?.start_time);
        const endTime = toSecond(tagList[curIdx]?.end_time);

        if (currentTime < startTime) {
            seekTo(startTime);
        }

        if (currentTime > endTime) {
            if (tagList.length <= curIdx) {
                // last tag
                setPlay(false);
                setOpen(false);
            } else {
                setCurIdx((c) => c + 1);
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

    return (
        <>
            <div className="player-wrapper tag-video">
                <ReactPlayer
                    className="react-player"
                    url={videoURL}
                    muted={muteState}
                    // url={VIDEO}
                    ref={player}
                    onPlay={() => setPlay(true)}
                    onPause={() => setPlay(false)}
                    onReady={() => setReady(true)}
                    onProgress={(p) => onProgress(p.playedSeconds)}
                    playing={play}
                    controls={false}
                    width="100%"
                    height="100%"
                />
            </div>
            {ready && (
                <div style={styles.actionControls} className="play-action-controls">
                    {!!tagList[curIdx] && (
                        <div style={styles.action}>
                            <div
                                style={{
                                    backgroundColor: 'rgb(62 62 62 / 62%)',
                                    padding: 5,
                                    borderRadius: 5,
                                    width: '40%',
                                    maxWidth: 120,
                                    textAlign: 'center'
                                }}
                            >
                                {tagList[curIdx]?.action_name}
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgb(254 124 1 / 69%)',
                                    padding: '5px 10px',
                                    borderRadius: 5
                                }}
                            >
                                #{tagList[curIdx]?.jersey} {tagList[curIdx]?.player_lname} {tagList[curIdx]?.player_fname.slice(0, 1)}.
                            </div>
                        </div>
                    )}
                    <div style={styles.buttonBox}>
                        <IconButton onClick={() => PlayVideo(-1)} style={styles.button}>
                            {document.body.style.direction === 'ltr' ? <SkipPreviousSharpIcon color="white" /> : <SkipNextSharpIcon />}
                        </IconButton>

                        <IconButton onClick={() => setPlay((p) => !p)} style={styles.button}>
                            {play ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>

                        <IconButton onClick={() => PlayVideo(1)} style={styles.button}>
                            {document.body.style.direction === 'ltr' ? <SkipNextSharpIcon /> : <SkipPreviousSharpIcon color="white" />}
                        </IconButton>
                    </div>
                </div>
            )}
        </>
    );
}
