import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from "./basic/ModalList"

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
  `;

export default function Cross({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(1);
  const [result, setResult] = React.useState(3);

  return (
    <>
      <PlayerSelector
        title="List of Players"
        playerList={offenseTeam}
        editable={false}
        selected={offensivePlayer}
        onSelect={(player) => setOffensivePlayer(player)}
      />
      <SubBox>
        <List header="Type">
          {[
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
          ].map((type, i) => (
            <ListItemButton key={i}
              selected={actionTypeId === type.id}
              onClick={() => setActionTypeId(type.id)}
            >
              <ListItemText primary={type.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <SubBox>
        <List header="Result">
          {[
            { id: 3, name: "Goal" },
            { id: 2, name: "Off Target" },
            { id: 9, name: "Goalkeeper Saved" },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={result === r.id}
              onClick={() => {
                setResult(r.id)
                if (r.id !== 9) {
                  taggingState([{
                    action_type_id: actionTypeId,
                    team_id: offenseTeamId,
                    player_id: offensivePlayer.id,
                    action_id: 4,
                    action_result_id: r.id
                  }])
                }
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {result === 9 &&
        <PlayerSelector
          title="GoalKeepers"
          playerList={defenseTeam}
          editable={false}
          selected={defensivePlayer}
          onSelect={(player) => {
            setDefensivePlayer(player)
            taggingState([
              {
                action_type_id: actionTypeId,
                team_id: offenseTeamId,
                player_id: offensivePlayer.id,
                action_id: 4,
                action_result_id: result
              },
              {
                action_type_id: actionTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 12,
                action_result_id: result
              },
            ])
          }}
        />
      }
    </>
  );
}