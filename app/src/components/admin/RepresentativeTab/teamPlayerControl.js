import { CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import GameService from '../../../services/game.service';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

const TeamPlayerControl = ({ team }) => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPlayerList([]);

        if (team === null) return;

        setLoading(true);
        GameService.getPlayersByTeam(team.team_id, team.season_id).then((res) => {
            setPlayerList(res);
            setLoading(false);
        });
    }, [team]);

    console.log('academy_teams => ', playerList);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', textAlign: 'center', margin: 0 }}>Players</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #E8E8E8', borderRadius: '8px', width: '528px', height: '70vh', padding: '16px 12px' }}>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '8px', maxHeight: '65vh', overflowY: 'auto' }}>
                        {playerList.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid white',
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    width: '240px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px' }}>
                                    <img src={item.image ? item.image : PLAYER_ICON_DEFAULT} style={{ height: '60px', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>#{item.jersey_number}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{`${item.f_name} ${item.l_name}`}</Typography>
                                    </div>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'white' }}>{item.pos_name}</Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamPlayerControl;
