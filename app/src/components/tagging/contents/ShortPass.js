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

export default function ShortPass({ defenseTeam, offenseTeam }) {

  const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    onTarget: "Yes"
  })

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
                // selected={state.offensePlayer === player}
                // onClick={() => setState({ offensePlayer: player })}
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
            { id: 1, name: "Successful" },
            { id: 2, name: "TurnOver" },
          ].map((type, i) => (
            <ListItemButton key={i}
              // selected={playerTag.action_type_id === type.id}
              // onClick={() => setPlayerTag({ action_type_id: type.id })}
            >
              <ListItemText primary={type.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <SubBox>
        <List
          sx={{ bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Saved
            </ListSubheader>
          }
        >
          {
            defenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={state.savedPlayer === player}
                onClick={() => setState({ savedPlayer: player })}
              >
                <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.date_of_birth && player.date_of_birth.slice(0, 10)})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
    </>
  );
}