import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
    IconButton,
    Switch,
    FormControlLabel
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { toSecond } from "../../common/utilities"
import gameService from '../../services/game.service';
import VIDEO from '../../assets/1.mp4'

const styles = {
    action: {
        position: "absolute",
        left: "3%",
        bottom: 10,
        zIndex: 100,
        color: "white",
        fontSize: 14,
        display: "flex",
        width: "50%",
    },
    buttonBox: {
        position: "absolute",
        bottom: 5,
        left: 0,
        width: "50%",
        minWidth: 300,
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    button: {
        color: "white", backgroundColor: "#80808069"
    }
}
export default function VideoPlayer({ videoData, url, onChangeClip }) {
    const { tagList, autoPlay, idx, videoPlay } = videoData

    const player = useRef(null)
    const [play, setPlay] = useState(true)
    const [ready, setReady] = useState(false)
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState("")
    const [canNext, setCanNext] = useState(true)

    useEffect(() => {
        if (url?.startsWith("https://www.youtube.com")) {
            gameService.getNewStreamURL(url).then((res) => {
                setVideoURL(res.url)
            })
        } else (
            setVideoURL(url)
        )
    }, [url])

    useEffect(() => {
        if (!ready) return;

        if (!tagList.length) return

        playTagByIdx(idx)
        setCurIdx(idx)
        setPlay(videoPlay)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, idx, videoPlay, ready])

    useEffect(() => {
        onChangeClip(tagList[curIdx]?.id ?? 0)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curIdx, tagList])

    const seekTo = (sec) => player.current && player.current.seekTo(sec)

    const playTagByIdx = (i) => seekTo(toSecond(tagList[i]?.start_time))

    const onProgress = (currentTime) => {
        const startTime = toSecond(tagList[curIdx]?.start_time);
        const endTime = toSecond(tagList[curIdx]?.end_time);

        if (currentTime < startTime) {
            seekTo(startTime)
        }

        if (currentTime > endTime) {
            if (tagList.length <= curIdx) {// last tag
                setPlay(false)
            }
            else if (canNext) { // is auto play, next clip
                setCurIdx(c => c + 1)
            } else {
                setPlay(false)
            }
        }
    }

    const PlayVideo = (num) => {
        let index;
        if (curIdx + num >= tagList.length) { index = 0 }
        else if (curIdx + num < 0) { index = tagList.length - 1 }
        else index = curIdx + num

        playTagByIdx(index)
        setPlay(true)
        setCurIdx(index)
    }

    return (
        <div style={{ width: "100%", margin: 'auto', minWidth: 500, position: "relative" }}>
            <div style={{ width: "98%", margin: 'auto' }}>
                <div className="player-wrapper">
                    <ReactPlayer
                        className="react-player"
                        url={VIDEO}
                        ref={player}
                        onPlay={() => setPlay(true)}
                        onPause={() => setPlay(false)}
                        onReady={() => setReady(true)}
                        onProgress={(p) => onProgress(p.playedSeconds)}
                        playing={play}
                        controls={true}
                        width='100%'
                        height='100%'
                    />
                </div>
            </div>
            <div style={styles.buttonBox} >
                <IconButton onClick={() => PlayVideo(-1)} style={styles.button}>
                    <SkipPreviousSharpIcon color="white" />
                </IconButton>

                <IconButton onClick={() => setPlay(p => !p)} style={styles.button}>
                    {play ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton onClick={() => PlayVideo(1)} style={styles.button}>
                    <SkipNextSharpIcon />
                </IconButton>

                {autoPlay &&
                    <FormControlLabel
                        control={<Switch defaultChecked onChange={(e) => setCanNext(e.target.checked)} />}
                        label="Auto Play"
                        sx={{ color: "white" }}
                    />
                }
            </div>
        </div >
    )
}