import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export default function TagVideo({ url }) {
    const player = useRef(null)
    const [play, setPlay] = useState(false)
    return (
        <div className="player-wrapper">
            <ReactPlayer
                className="react-player"
                url={url}
                ref={player}
                onPlay={() => setPlay(true)}
                onPause={() => setPlay(false)}
                playing={play}
                controls={true}
                width='100%'
                height='100%'
            />
        </div>
    )
}