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
  offenseTeam, 
  taggingState, 
  startTime, 
  endTime,
  offenseTeamId, 
}) {

  return (
    <>
      <SubBox>
        <List header="List of Players">
          {
            offenseTeam.map((player, i) => (
              <ListItemButton key={i}
                onClick={() => 
                  taggingState([{
                    start_time: startTime,
                    end_time: endTime,
                    team_id: offenseTeamId,
                    player_id: player.id,
                    action_type_id: 4, 
                    action_result_id: 4, 
                    action_id: 2
                  }])
                }
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