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

const RESULT_LIST = [
  { id: 4, name: "Successful" },
  { id: 7, name: "Blocked" },
  { id: 8, name: "Cleared" },
  { id: 15, name: "Offside" },
]

export default function Cross({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [offsidePlayer, setOffsidePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(1);
  const [result, setResult] = React.useState(RESULT_LIST[0]);

  return (
    <>
      <PlayerSelector
        title="Offensive Player List"
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
            { id: 11, name: "Free Kick" },
            { id: 12, name: "Corner" },
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
                if (r.name === "Successful") {
                  taggingState([{
                    action_type_id: actionTypeId,
                    team_id: offenseTeamId,
                    player_id: offensivePlayer.id,
                    action_id: 3,
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
      {result.name === "Offside" ?
        <PlayerSelector
          title="Offensive Player List"
          playerList={offenseTeam}
          editable={false}
          selected={offsidePlayer}
          onSelect={(player) => {
            setOffsidePlayer(player)
            taggingState([
              {
                action_type_id: actionTypeId,
                team_id: offenseTeamId,
                player_id: offensivePlayer.id,
                action_id: 3, //cross
                action_result_id: result.id
              },
              {
                action_type_id: actionTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 7, //Turnover
                action_result_id: result.id
              },
            ])
          }}
        />
        :
        result.name !== "Successful" &&
        <PlayerSelector
          title="Defensive Player List"
          playerList={defenseTeam}
          editable={false}
          selected={defensivePlayer}
          onSelect={(player) => {
            setDefensivePlayer(player)
            if (result.name === "Blocked")
              taggingState([
                {
                  action_type_id: actionTypeId,
                  team_id: offenseTeamId,
                  player_id: offensivePlayer.id,
                  action_id: 3, //cross
                  action_result_id: result.id
                },
                {
                  action_type_id: actionTypeId,
                  team_id: defenseTeamId,
                  player_id: player.id,
                  action_id: 10, //interception 
                  action_result_id: result.id
                },
              ])
            if (result.name === "Cleared")
              taggingState([
                {
                  action_type_id: actionTypeId,
                  team_id: offenseTeamId,
                  player_id: offensivePlayer.id,
                  action_id: 3, //cross
                  action_result_id: result.id
                },
                {
                  action_type_id: actionTypeId,
                  team_id: defenseTeamId,
                  player_id: player.id,
                  action_id: 11, //clearance
                  action_result_id: result.id
                },
              ])
          }}
        />

      }
    </>
  );
}