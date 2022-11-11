import * as React from 'react';
import PlayerSelector from './basic/PlayerSelector';
import gameService from '../../../services/game.service';

export default function SelectMainPlayers({ homeTeam, awayTeam, game, setGamePlayerRefresh }) {
    const [posList, setPosList] = React.useState([]);
    React.useEffect(() => {
        gameService.getAllPositions().then((res) => {
            setPosList(res);
        });
    }, []);
    return (
        <>
            <PlayerSelector title="Home Team" playerList={homeTeam} game={game} posList={posList} setGamePlayerRefresh={setGamePlayerRefresh} onSelect={(player) => {}} />

            <PlayerSelector title="Away Team" playerList={awayTeam} game={game} posList={posList} setGamePlayerRefresh={setGamePlayerRefresh} onSelect={(player) => {}} />
        </>
    );
}
