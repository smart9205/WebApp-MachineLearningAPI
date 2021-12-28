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

export default function ShortPass({ defenseTeam, offenseTeam, taggingState }) {

  const [result, setResult] = React.useState({})
  const [offensivePlayer, setOffensivePlayer] = React.useState({});
  const [defensivePlayer, setDefensivePlayer] = React.useState({});

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
            { id: 4, name: "Successful" },
            { id: 5, name: "Turnover" },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={result === r}
              onClick={() => {
                setResult(r) 
                if(r.name === "Successful")
                  taggingState({
                    player_id: offensivePlayer.id,
                    action_id: 2,
                    action_type_id: 4, 
                    action_result_id: r.id
                  })
              }}// here we need to call to a new function and pass parameters player id, action id , action type, action result, 
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {result === "Turnover" && <SubBox>
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
                onClick={() => {
                  setDefensivePlayer(player)
                  taggingState({
                    player_id: defensivePlayer.id,
                    action_id: 2,
                    action_type_id: 4, 
                    action_result_id: result.id
                  })
                }}
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