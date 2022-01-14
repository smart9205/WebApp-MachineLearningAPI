import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
    IconButton,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import { toSecond } from "../../common/utilities"

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
        display: 'flex',
        justifyContent: 'space-evenly'
    }
}
export default function TagVideo({ tagList, url }) {
    const player = useRef(null)
    const [play, setPlay] = useState(true)
    const [ready, setReady] = useState(false)
    const [curIdx, setCurIdx] = useState(0);

    useEffect(() => {
        if (!ready) return;

        if (!tagList.length) return

        playTagByIdx(0)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, ready])

    const seekTo = (sec) => player.current.seekTo(sec)

    const playTagByIdx = (i) => seekTo(toSecond(tagList[i]?.start_time))

    const onProgress = (currentTime) => {
        // console.log("Progress", currentTime)
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
                    url={url}
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
            <div style={styles.buttonBox}>
                <IconButton onClick={() => PlayVideo(-1)}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                <IconButton onClick={() => setPlay(p => !p)}>
                    {play ? <PauseCircleOutlineOutlinedIcon /> : <PlayCircleOutlineOutlinedIcon />}
                </IconButton>

                <IconButton onClick={() => PlayVideo(1)}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </div>
        </div >
    )
}