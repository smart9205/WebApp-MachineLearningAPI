import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import GameService from "../../services/game.service";
import { toHHMMSS, toSecond } from "../../common/utilities"
import VIDEO from '../../assets/1.mp4';

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
    }
}
export default function TagVideo({ playerId, game }) {
    const player = useRef(null)
    const [play, setPlay] = useState(false)
    const [tagList, setTagList] = useState([])
    const [ready, setReady] = useState(false)
    const [curIdx, setCurIdx] = useState(0);

    useEffect(() => {
        GameService.getAllPlayerTagsByPlayer(playerId, game.game_id).then((res) => {
            console.log("Player Tag Result", res)
            setTagList(res)
            setCurIdx(0)
        })
    }, [playerId, game])

    useEffect(() => {
        console.log("HHEEE", tagList, ready)
        if (!ready) return

        if (!tagList.length) { }

        // seekTo(tagList[0].start_time)

    }, [tagList, ready])

    const seekTo = (sec) => player.current.seekTo(sec)

    const onProgress = (currentTime) => {
        // console.log("Progress", currentTime)
        const startTime = toSecond(tagList[curIdx].start_time);
        const endTime = toSecond(tagList[curIdx].end_time);

        if (currentTime < startTime) {
            // seekTo(startTime)
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

    return (
        <>
            {ready && tagList[curIdx] &&
                <div style={styles.action}>
                    <div>Action: {tagList[curIdx].action_name}</div>
                    <div>Action Type: {tagList[curIdx].action_type_name}</div>
                    <div>Action Result: {tagList[curIdx].action_result_name}</div>
                </div>
            }
            <div className="player-wrapper">
                <ReactPlayer
                    className="react-player"
                    // url={game.video_url}
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
        </>
    )
}