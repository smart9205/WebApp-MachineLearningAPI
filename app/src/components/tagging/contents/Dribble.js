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
  { id: 4, name: "Successful" },
  { id: 10, name: "Unsuccessful" },
  { id: 16, name: "Draw Foul" },
]


export default function Dribble({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [offsidePlayer, setOffsidePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(1);
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
                <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.position})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>

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
          {RESULT_LIST.map((r, i) => (
            <ListItemButton key={r.id}
              selected={result === r}
              onClick={() => {
                setResult(r)
                if (r.name !== "Draw Foul")
                  taggingState([
                    {
                      action_type_id: actionTypeId,
                      team_id: offenseTeamId,
                      player_id: offensivePlayer.id,
                      action_id: 4, //Dribble
                      action_result_id: result.id
                    },
                  ])
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {
        result.name === "Draw Foul" &&
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
                        action_id: 4, //Dribble
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
                  <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.position})`} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }

    </>
  );
}