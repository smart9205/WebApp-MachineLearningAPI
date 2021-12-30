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

export default function Shot({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [assistPlayer, setAssistPlayer] = React.useState(offenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(1);
  const [onTarget, setOnTarget] = React.useState("Yes");
  const [goal, setGoal] = React.useState("No");

  const targetClicked = (target) => {
    setOnTarget(target)
    if (target === "No") {
      taggingState([{
        action_type_id: actionTypeId,
        team_id: offenseTeamId,
        player_id: offensivePlayer.id,
        action_id: 1,
        action_result_id: 2
      }])
    };
  }


  return (
    <>
      <SubBox>
        <List header="List of Players">
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
            { id: 3, name: "Header" }
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
        <List header="On Target">
          {
            ["Yes", "No"].map((t, i) => (
              <ListItemButton key={i}
                selected={onTarget === t}
                onClick={() => targetClicked(t)}
              >
                <ListItemText primary={t} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
      {
        onTarget === "Yes" &&
        <SubBox>
          <List header="Goal">
            {
              ["Yes", "No"].map((g, i) => (
                <ListItemButton key={i}
                  selected={goal === g}
                  onClick={() => setGoal(g)}
                >
                  <ListItemText primary={g} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }
      {
        onTarget === "Yes" && goal === "Yes" &&
        <SubBox>
          <List header="Assist">
            {
              offenseTeam.map((player, i) => (
                <ListItemButton key={i} selected={assistPlayer === player}
                  onClick={() => {
                    setAssistPlayer(player)
                    taggingState([
                      {
                        action_type_id: actionTypeId,
                        team_id: offenseTeamId,
                        player_id: offensivePlayer.id,
                        action_id: 11,
                        action_result_id: 3
                      },
                      {
                        action_type_id: actionTypeId,
                        team_id: offenseTeamId,
                        player_id: player.id,
                        action_id: 13,
                        action_result_id: 3
                      }
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
      {
        goal === "No" &&
        <SubBox>
          <List header="Saved">
            {
              defenseTeam.map((player, i) => (
                <ListItemButton key={i}
                  onClick={() => {
                    taggingState([
                      {
                        action_type_id: actionTypeId,
                        team_id: offenseTeamId,
                        player_id: offensivePlayer.id,
                        action_id: 12,
                        action_result_id: 1
                      },
                      {
                        action_type_id: actionTypeId,
                        team_id: defenseTeamId,
                        player_id: player.id,
                        action_id: 12,
                        action_result_id: 1
                      }
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