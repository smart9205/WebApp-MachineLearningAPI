import React from 'react';
import { PLAYER_ICON_DEFAULT } from '../../common/staticData';

export default function PlayerDatailCard({ player }) {

    return (
        <div className="player-detail-card">
            <div className="profileImg-wrapper">
                <div
                    className='profileimg'
                    style={{ backgroundImage: `url(${player?.image?.length > 0 ? player?.image : PLAYER_ICON_DEFAULT})` }}>
                </div>
            </div>

            <div className='profileInfo'>
                <p>{player?.name}</p>
                <p>Jersey : {player?.jersey_number}</p>
                <p>{player?.position_name}</p>
            </div>
        </div>
    )
}