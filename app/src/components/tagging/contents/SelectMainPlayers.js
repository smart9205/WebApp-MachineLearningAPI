import * as React from 'react';
import PlayerSelector from './basic/PlayerSelector';
import gameService from '../../../services/game.service';

export default function SelectMainPlayers({
  homeTeam,
  awayTeam
}) {
  const [posList, setPosList] = React.useState([])
  React.useEffect(() => {
    gameService.getAllPositions().then(res => {
      setPosList(res)
    })
  }, [])
  return (
    <>
      <PlayerSelector title="Home Team" playerList={homeTeam} posList={posList} />

      <PlayerSelector title="Away Team" playerList={awayTeam} posList={posList} />
    </>
  );
}
