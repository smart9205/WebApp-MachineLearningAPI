import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from "./basic/ModalList"
import { Checkbox } from '@mui/material';

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
    max-height: 90vh;
    overflow-y: auto;
  }
  `;

export default function SelectMainPlayers({
  homeTeam,
  awayTeam,
  onHomePlayerChecked,
  onAwayPlayerChecked
}) {
  return (
    <>
      <SubBox>
        <List header="Home Team">
          {
            homeTeam.map((player, i) => (
              <ListItemButton key={i} className="player-select-checkbox" >
                <Checkbox checked={!player?.checked} onChange={(e) => onHomePlayerChecked(i, !e.target.checked)} />
                <ListItemText primary={`#${player.jersey_number}  ${player.f_name} ${player.l_name}  (${player.position_name})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
      <SubBox>
        <List header="Away Team">
          {
            awayTeam.map((player, i) => (
              <ListItemButton key={i} className="player-select-checkbox" >
                <Checkbox checked={!player?.checked} onChange={(e) => onAwayPlayerChecked(i, !e.target.checked)} />
                <ListItemText primary={`#${player.jersey_number}  ${player.f_name} ${player.l_name}  (${player.position_name})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
    </>
  );
} 