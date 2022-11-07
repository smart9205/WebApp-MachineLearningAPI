import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import GameService from '../../../../../services/game.service';
import TeamPlayerLogo from './playerLogo';
import TeamPlayerOverviewStatDialog from './status';

const TeamPlayerLogoList = ({ games, gameIds, teamId, setIds }) => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectArray, setSelectArray] = useState([]);
    const [statOpen, setStatOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerState, setPlayerState] = useState(null);

    let statClick = false;

    const handleSelectPlayer = (index) => {
        if (!statClick) {
            setSelectArray({ ...selectArray, [index]: !selectArray[index] });
            statClick = false;
        } else setSelectArray({ ...selectArray, [index]: false });
    };

    const handleDisplayList = (player) => {
        statClick = true;
        GameService.getPlayersStatsAdvanced({
            seasonId: null,
            leagueId: null,
            gameId: gameIds.join(','),
            teamId: teamId,
            playerId: player.player_id,
            gameTime: '1,2,3,4,5,6',
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null
        }).then((res) => {
            setPlayerState(res[0]);
            setStatOpen(true);
            setCurrentPlayer(player);
        });
    };

    useEffect(() => {
        if (teamId !== -1 && gameIds.length > 0) {
            setLoading(true);
            setPlayerList([]);
            GameService.getGameCoachTeamPlayers(teamId, gameIds.join(',')).then((res) => {
                setPlayerList(res);
                setLoading(false);
                setSelectArray([]);
                res.map((item) => setSelectArray((old) => [...old, false]));
            });
        } else setPlayerList([]);
    }, [gameIds, teamId]);

    useEffect(() => {
        const ids = playerList.filter((item, index) => selectArray[index] === true).map((item) => item.player_id);

        setIds(ids);
    }, [selectArray]);

    console.log('playerlogo => ', playerList, games);

    return (
        <Box sx={{ minWidth: '600px' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto auto auto auto auto', gap: '0px' }}>
                {playerList.map((item, index) => (
                    <Box key={index} sx={{ borderRadius: '10px', border: selectArray[index] ? '4px solid #0A7304' : '4px solid white', cursor: 'pointer' }} onClick={() => handleSelectPlayer(index)}>
                        <TeamPlayerLogo player={item} onShow={handleDisplayList} />
                    </Box>
                ))}
            </Box>
            <TeamPlayerOverviewStatDialog open={statOpen} onClose={() => setStatOpen(false)} player={currentPlayer} games={games} gameIds={gameIds} teamId={teamId} initialState={playerState} />
        </Box>
    );
};

export default TeamPlayerLogoList;
