import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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
        <List
          sx={{ bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              List of Players
            </ListSubheader>
          }
        >
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
        <List
          sx={{ bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={<ListSubheader component="div" id="nested-list-subheader">Result</ListSubheader>}
        >
          {[
            { id: 4, name: SUCCESSFUL },
            { id: 5, name: STOLE_BY },
            { id: 11, name: BAD_PASS },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={result?.id === r.id}
              onClick={() => {
                setResult(r) 
                if(r.name === SUCCESSFUL)
                  taggingState([{
                    player_id: offensivePlayer.id,
                    action_id: 2,
                    action_type_id: 4, 
                    action_result_id: r.id
                  }])
                if(r.name === BAD_PASS)
                  taggingState([{
                    ...tagData,
                    team_id: offenseTeamId,
                    player_id: offensivePlayer.id,
                    action_id: 10,
                    action_type_id: 4, 
                    action_result_id: r.id
                  }])
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {result.name === STOLE_BY && <SubBox>
        <List
          sx={{ bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Defensive Player List
            </ListSubheader>
          }
        >
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