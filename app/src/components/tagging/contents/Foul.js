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

const RESULT_LIST = [
  { id: 13, name: "Free Kick" },
  { id: 14, name: "Penalty" },
]


export default function Foul({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(8);
  const [result, setResult] = React.useState(RESULT_LIST[0]);

  return (
    <>
      <SubBox>
        <List header="Offensive Player List">
          {
            offenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={offensivePlayer === player}
                onClick={() => setOffensivePlayer(player)}
              >
                <ListItemText primary={`#${player.jersey_number}  ${player.f_name} ${player.l_name}  (${player.position_name})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>

      <SubBox>
        <List header="Type">
          {[
            { id: 8, name: "Regular" },
            { id: 9, name: "Yellow Card" },
            { id: 10, name: "Red Card" },
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
          {RESULT_LIST.map((r, i) => (
            <ListItemButton key={r.id}
              selected={result === r}
              onClick={() => setResult(r)}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <SubBox>
        <List header="Defensive Player List">
          {
            defenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={defensivePlayer === player}
                onClick={() => {
                  setDefensivePlayer(player)
                  taggingState([
                    {
                      action_type_id: actionTypeId,
                      team_id: offenseTeamId,
                      player_id: offensivePlayer.id,
                      action_id: 6, //Draw Foul
                      action_result_id: result.id
                    },
                    {
                      action_type_id: actionTypeId,
                      team_id: defenseTeamId,
                      player_id: player.id,
                      action_id: 5, //Foul 
                      action_result_id: result.id
                    },
                  ])
                }}
              >
                <ListItemText primary={`#${player.jersey_number}  ${player.f_name} ${player.l_name}  (${player.position_name})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
    </>
  );
}