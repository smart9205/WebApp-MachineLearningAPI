import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
    IconButton,
    Switch,
    FormControlLabel
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextSharpIcon from '@mui/icons-material/SkipNextSharp';
import SkipPreviousSharpIcon from '@mui/icons-material/SkipPreviousSharp';
import { toSecond } from "../../../../common/utilities"
import gameService from '../../../../services/game.service';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import VIDEO from '../../../../assets/1.mp4'

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
        paddingInline: "7%",
        minWidth: 300,
        display: 'flex',
        gap: "1rem",
        alignItems: "center",
        justifyContent: 'space-evenly'
    },
    button: {
        color: "white", backgroundColor: "#80808069"
    }
}
export default function VideoPlayer({ videoData, onChangeClip, tagList, drawOpen = true }) {
    const handle = useFullScreenHandle();
    const { autoPlay, idx, videoPlay, cnt = null } = videoData

    const player = useRef(null)
    const [play, setPlay] = useState(false)
    const [ready, setReady] = useState(false)
    const [curIdx, setCurIdx] = useState(0);
    const [curOriginURL, setCurOriginURL] = useState(null);
    const [videoURL, setVideoURL] = useState("")
    const [canNext, setCanNext] = useState(true)

    useEffect(() => {
        if (!ready) return;

        if (!tagList.length) return

        setCurIdx(idx)

        setPlay(videoPlay)

        playTagByIdx(idx)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, videoData, videoURL, ready])

    useEffect(() => {
        const url = tagList[curIdx]?.video_url ?? ''

        if (url !== curOriginURL) {
            if (url?.startsWith("https://www.youtube.com")) {
                gameService.getNewStreamURL(url).then((res) => {
                    setVideoURL(res.url)
                })
            } else (
                setVideoURL(url)
            )

            setCurOriginURL(url)
        }

        if (autoPlay)
            onChangeClip(curIdx)

        playTagByIdx(curIdx)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, curIdx])

    const seekTo = (sec) => player.current && player.current.seekTo(sec)

    const playTagByIdx = (i) => seekTo(toSecond(tagList[i]?.start_time))

    const onProgress = (currentTime) => {
        const endTime = toSecond(tagList[curIdx]?.end_time);

        if (currentTime >= endTime) {
            if (tagList.length <= curIdx + 1) {// last tag
                setPlay(false)
            }
            else if (canNext) { // is auto play, next clip
                setCurIdx(c => c + 1)
                PlayVideo(1)
            } else {
                setPlay(false)
            }
        }
    }

    const PlayVideo = (num) => {
        let index;
        if (curIdx + num >= tagList.length) {
            setPlay(false)
        } else {
            if (curIdx + num < 0) { index = tagList.length - 1 }
            else index = curIdx + num
            playTagByIdx(index)
            setPlay(true)
            setCurIdx(index)
        }
    }

    return (
        <div style={{ width: "100%", margin: 'auto', minWidth: 500, position: "relative", overflow: "hidden" }}>
            <FullScreen handle={handle}>
                <div style={{ width: drawOpen ? "100%" : "90%", margin: 'auto' }}>
                    <div className="player-wrapper">
                        <ReactPlayer
                            className="react-player"
                            url={videoURL}
                            // url={VIDEO}
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

                    <IconButton onClick={handle.active ? handle.exit : handle.enter} style={styles.button}>
                        {handle.active ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
                    </IconButton>
                </div>
            </FullScreen>
        </div >
    )
}