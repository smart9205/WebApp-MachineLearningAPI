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

export default function ShortPass({
  offenseTeam,
  taggingState,
  offenseTeamId,
}) {

  return (
    <>
      <SubBox>
        <List header="List of Players">
          {
            offenseTeam.map((player, i) => (
              !player?.checked && <ListItemButton key={i}
                onClick={() =>
                  taggingState([{
                    team_id: offenseTeamId,
                    player_id: player.id,
                    action_type_id: 4,
                    action_result_id: 4,
                    action_id: 2
                  }])
                }
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