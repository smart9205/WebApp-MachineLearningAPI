import * as React from 'react';
import PlayerSelector from './basic/PlayerSelector';

export default function ShortPass({
  offenseTeam,
  taggingState,
  offenseTeamId,
}) {

  return (
    <PlayerSelector
      title="List of Players"
      playerList={offenseTeam}
      editable={false}
      onSelect={(player) => taggingState([{
        team_id: offenseTeamId,
        player_id: player.id,
        action_type_id: 4,
        action_result_id: 4,
        action_id: 2
      }])}
    />
  );
} 