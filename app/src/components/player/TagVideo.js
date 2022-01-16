import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
    IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import { toSecond } from "../../common/utilities"
import gameService from '../../services/game.service';

const styles = {
    action: {
        position: "absolute",
        left: "20px",
        top: "20px",
        zIndex: 100,
        backgroundColor: "#3e3e3eba",
        color: "white",
        fontSize: 12,
        padding: 10
    },
    buttonBox: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        display: 'flex',
        justifyContent: 'space-evenly'
    },
}
export default function TagVideo({ tagList, url }) {
    const player = useRef(null)
    const [play, setPlay] = useState(true)
    const [ready, setReady] = useState(false)
    const [curIdx, setCurIdx] = useState(0);
    const [videoURL, setVideoURL] = useState("")

    useEffect(() => {
        if (url.startsWith("https://www.youtube.com")) {
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

        playTagByIdx(0)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, ready])

    const seekTo = (sec) => player.current.seekTo(sec)

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
            else {
                setCurIdx(c => c + 1)
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
        <div>
            <div className="player-wrapper">
                <ReactPlayer
                    className="react-player"
                    url={videoURL}
                    ref={player}
                    onPlay={() => setPlay(true)}
                    onPause={() => setPlay(false)}
                    onReady={() => setReady(true)}
                    onProgress={(p) => onProgress(p.playedSeconds)}
                    playing={play}
                    controls={false}
                    width='100%'
                    height='100%'
                />
            </div>
            <div style={styles.buttonBox} >
                <IconButton onClick={() => PlayVideo(-1)} style={{ color: "white" }}>
                    <SkipPreviousSharpIcon color="white" />
                </IconButton>

                <IconButton onClick={() => setPlay(p => !p)} style={{ color: "white" }}>
                    {play ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton onClick={() => PlayVideo(1)} style={{ color: "white" }}>
                    <SkipNextSharpIcon />
                </IconButton>
            </div>
        </div >
    )
}