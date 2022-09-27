import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import GameService from '../../../../../services/game.service';
import GamePlayerLogo from './playerLogo';

const GamePlayerLogoList = ({ game, teamId, our, setIds }) => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectArray, setSelectArray] = useState([]);

    const handleSelectPlayer = (index) => {
        setSelectArray({ ...selectArray, [index]: !selectArray[index] });
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
                        <GamePlayerLogo player={item} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default GamePlayerLogoList;
