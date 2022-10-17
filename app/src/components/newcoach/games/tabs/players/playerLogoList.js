import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import GameService from '../../../../../services/game.service';
import GamePlayerLogo from './playerLogo';
import GamePlayerStatDialog from './status';

const GamePlayerLogoList = ({ game, teamId, opponent, our, setIds, where }) => {
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
            seasonId: game.season_id,
            leagueId: game.league_id,
            gameId: game.id,
            teamId: our ? teamId : opponent,
            playerId: player.player_id,
            gameTime: '1,2,3,4,5,6',
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null,
            our: where === 'Games' ? our : false
        }).then((res) => {
            setPlayerState(res[0]);
            setStatOpen(true);
            setCurrentPlayer(player);
        });
    };

    useEffect(() => {
        setLoading(true);
        setPlayerList([]);

        if (teamId !== -1) {
            if (our) {
                GameService.getGameCoachTeamPlayers(teamId, `${game.id}`).then((res) => {
                    setPlayerList(res);
                    setLoading(false);
                    setSelectArray([]);
                    res.map((item) => setSelectArray((old) => [...old, false]));
                });
            } else {
                GameService.getGameOpponentPlayers(teamId, `${game.id}`).then((res) => {
                    setPlayerList(res);
                    setLoading(false);
                    setSelectArray([]);
                    res.map((item) => setSelectArray((old) => [...old, false]));
                });
            }
        }
    }, [game, teamId, our]);

    useEffect(() => {
        const ids = playerList.filter((item, index) => selectArray[index] === true).map((item) => item.player_id);

        setIds(ids);
    }, [selectArray]);

    console.log('playerlogo => ', playerList, game);

    return (
        <Box sx={{ minWidth: '600px' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto auto auto auto auto', gap: '2px' }}>
                {playerList.map((item, index) => (
                    <Box key={index} sx={{ borderRadius: '10px', border: selectArray[index] ? '4px solid #0A7304' : '4px solid white', cursor: 'pointer' }} onClick={() => handleSelectPlayer(index)}>
                        <GamePlayerLogo player={item} onShow={handleDisplayList} />
                    </Box>
                ))}
            </Box>
            <GamePlayerStatDialog
                open={statOpen}
                onClose={() => setStatOpen(false)}
                player={currentPlayer}
                game={game}
                teamId={our ? teamId : opponent}
                our={our}
                initialState={playerState}
                where={where}
            />
        </Box>
    );
};

export default GamePlayerLogoList;
