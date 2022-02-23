import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from "./basic/ModalList"
import PlayerSelector from './basic/PlayerSelector';

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
  `;

export default function Shot({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
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
            { id: 3, name: "Header" },
            { id: 11, name: "Free Kick" },
            { id: 13, name: "Penalty" }
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
                  onClick={() => {
                    setGoal(g)
                    if (g === "Yes") {
                      taggingState([
                        {
                          action_type_id: actionTypeId,
                          team_id: offenseTeamId,
                          player_id: offensivePlayer.id,
                          action_id: 1,
                          action_result_id: 3
                        }
                      ])
                    }
                  }}
                >
                  <ListItemText primary={g} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }
      {
        goal === "No" &&
        <PlayerSelector
          title="Saved"
          playerList={defenseTeam}
          editable={false}
          onSelect={(player) => {
            taggingState([
              {
                action_type_id: actionTypeId,
                team_id: offenseTeamId,
                player_id: offensivePlayer.id,
                action_id: 1,
                action_result_id: 1
              },
              {
                action_type_id: actionTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 8,
                action_result_id: 1
              }
            ])
          }}
        />
      }
    </>
  );
}