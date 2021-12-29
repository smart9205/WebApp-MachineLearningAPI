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

export default function Shot({ defenseTeam, offenseTeam }) {

  const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
    onTarget: "Yes"
  })

  return (
    <>
      <SubBox>
        <List header="List of Players">
          {
            offenseTeam.map((player, i) => (
              <ListItemButton key={i}
                // selected={state.offensePlayer === player}
                // onClick={() => setState({ offensePlayer: player })}
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
              // selected={playerTag.action_type_id === type.id}
              // onClick={() => setPlayerTag({ action_type_id: type.id })}
            >
              <ListItemText primary={type.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <SubBox>
        <List header="On Target">
          {
            [
              { id: 1, name: "Yes" },
              { id: 2, name: "No" }
            ].map((target, i) => (
              <ListItemButton key={i}
                // selected={playerTag.action_result_id === target.id}
                // onClick={() => targetClicked(target)}
              >
                <ListItemText primary={target.name} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
      {
        state.onTarget === "Yes" &&
        <SubBox>
          <List header="Goal">
            {
              ["Yes", "No"].map((goal, i) => (
                <ListItemButton key={i}
                  selected={state.goal === goal}
                  onClick={() => setState({ goal })}
                >
                  <ListItemText primary={goal} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }
      {
        state.onTarget === "Yes" && state.goal === "Yes" &&
        <SubBox>
          <List header="Assist">
            {
              offenseTeam.map((player, i) => (
                <ListItemButton key={i} selected={state.assistPlayer === player}
                  onClick={() => setState({ assistPlayer: player })}
                >
                  <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.position})`} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }
      <SubBox>
        <List header="Saved">
          {
            defenseTeam.map((player, i) => (
              <ListItemButton key={i}
                selected={state.savedPlayer === player}
                onClick={() => setState({ savedPlayer: player })}
              >
                <ListItemText primary={`${player.f_name} ${player.l_name}  #${player.jersey_number}  (${player.position})`} />
              </ListItemButton>
            ))
          }
        </List>
      </SubBox>
    </>
  );
}