import React from 'react';

import moment from 'moment'
import { PLAYER_ICON_DEFAULT } from '../../common/staticData';
import { Col } from 'react-bootstrap'

export default function PlayerDatailCard({ player }) {

    return (
        <>
            <Col xs={6}>
                <div className='profileimg'>
                    <img src={player?.image ?? PLAYER_ICON_DEFAULT} alt="" />
                </div>
            </Col>
            <Col xs={6}>
                <div className='profileInfo'>
                    <p>{player?.name}</p>
                    <p>Jersy : {player?.jersey_number}</p>
                    <p>{player?.position_name}</p>
                </div>
            </Col>
        </>
    )
}