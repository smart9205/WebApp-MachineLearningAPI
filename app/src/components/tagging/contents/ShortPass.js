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

const SUCCESSFUL = "Successful"
const STOLE_BY = "Stole By"
const BAD_PASS = "Bad Pass"

export default function ShortPass({ 
  defenseTeam, 
  offenseTeam, 
  taggingState, 
  startTime, 
  endTime,
  defenseTeamId,
  offenseTeamId, 
}) {

  const [result, setResult] = React.useState({ id: 4, name: SUCCESSFUL })
  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState({});

  const tagData = {
    start_time: startTime,
    end_time: endTime
  }

  const defensivePlayerClicked = (player) => {
    setDefensivePlayer(player)
    taggingState([{
      ...tagData,
      team_id: defenseTeamId,
      player_id: player.id,
      action_id: 14,
      action_type_id: 4, 
      action_result_id: 11
    },{
      ...tagData,
      player_id: offensivePlayer.id,
      team_id: offenseTeamId,
      action_id: 10,
      action_type_id: 4, 
      action_result_id: 11
    }])
  }

  return (
    <>
      <SubBox>
        <List header="List of Players">
          {
            offenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={offensivePlayer === player}
                onClick={() => setOffensivePlayer( player )}
              >
                <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>

      <SubBox>
        <List header="Result">
          {[
            { id: 4, name: SUCCESSFUL },
            { id: 5, name: STOLE_BY },
            { id: 11, name: BAD_PASS },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={result?.id === r.id}
              onClick={() => {
                setResult(r) 
                const d = {
                  ...tagData,
                  team_id: offenseTeamId,
                  player_id: offensivePlayer.id,
                  action_type_id: 4, 
                  action_result_id: r.id
                };
                if(r.name === SUCCESSFUL) taggingState([{...d, action_id: 2,}])
                if(r.name === BAD_PASS) taggingState([{...d, action_id: 10,}])
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {result.name === STOLE_BY && <SubBox>
        <List header="Defensive Player List">
          {
            defenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={defensivePlayer === player}
                onClick={() => defensivePlayerClicked(player)}
              >
                <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>}
    </>
  );
} 