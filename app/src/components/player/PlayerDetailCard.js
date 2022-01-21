import React from 'react';

import moment from 'moment'
import { PLAYER_ICON_DEFAULT } from '../../common/staticData';
import { Col } from 'react-bootstrap'

export default function PlayerDatailCard({ player }) {

    return (
        <div className="player-detail-card">
            <div className='profileimg' style={{ backgroundImage: `url(${player?.image ?? PLAYER_ICON_DEFAULT})` }}>
                {/* <img src={player?.image ?? PLAYER_ICON_DEFAULT} alt="" /> */}
            </div>

            <div className='profileInfo'>
                <p>{player?.name}</p>
                <p>Jersy : {player?.jersey_number}</p>
                <p>{player?.position_name}</p>
            </div>
        </div>
    )
}