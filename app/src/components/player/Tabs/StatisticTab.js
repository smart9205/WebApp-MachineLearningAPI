import { CircularProgress, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { PlayerContext } from '..';
import GameService from '../../../services/game.service';
import { statList } from './SkillTab';

export default function StatisticTab({ games }) {
    const { context, setContext } = useContext(PlayerContext);
    const [playerStat, setPlayerStat] = useState(null);
    const [loading, setLoading] = useState(false);

    const getNormalStatList = () => {
        return statList.filter((item) => playerStat && playerStat[`total_${item.id}`] > 0);
    };

    useEffect(() => {
        setLoading(true);
        GameService.getPlayersStatsAdvanced({
            seasonId: null,
            leagueId: null,
            gameId: games ? games.map((item) => item.game_id).join(',') : null,
            teamId: null,
            playerId: context.player?.id ?? null,
            gameTime: null,
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null
        }).then((res) => {
            setPlayerStat(res[0]);
            setLoading(false);
        });
    }, [context]);

    return (
        <>
            {loading ? (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', left: 0, top: 0 }}>
                    <CircularProgress />
                </div>
            ) : (
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
                    {getNormalStatList().map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '4px',
                                padding: '6px 0',
                                width: '100%',
                                height: '60px',
                                borderRadius: '12px',
                                border: '1px solid #E8E8E8',
                                background: context.player?.second_color ?? 'white',
                                direction: 'ltr'
                            }}
                        >
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>
                                {playerStat[`total_${item.id}`] + ' (' + playerStat[`average_${item.id}`] + ' avg)'}
                            </Typography>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
