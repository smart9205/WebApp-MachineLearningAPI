import React from 'react';
import { PLAYER_ICON_DEFAULT, TEAM_ICON_DEFAULT } from '../../common/staticData';

export default function PlayerDatailCard({ player }) {

    console.log("teamname", player)

    return (
        <div className="player-detail-card">
            <div className='profileInfo'>
                <div>
                    <div className="player-detail-card_fullname">{player?.name}</div>
                    <div className='player-detail-card_team'>{player?.team_name}</div>
                </div>
                <div className='player-detail-card_jersey-pos'>
                    <div>#{player?.jersey_number}</div>
                    <div>{player?.position_name}</div>
                </div>
            </div>
            <div className="profileImg-wrapper">
                <div
                    className='profileimg'
                    style={{ backgroundImage: `url(${player?.image?.length > 0 ? player?.image : PLAYER_ICON_DEFAULT})` }}>
                </div>
                <div>
                    <img width="100" src={player.sponsor_logo || TEAM_ICON_DEFAULT} alt="sponsor" />
                </div>
                <div>
                    <img width="100" src={player.team_image || TEAM_ICON_DEFAULT} alt="team" />
                </div>
            </div>
        </div>
    )
}