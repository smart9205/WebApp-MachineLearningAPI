import * as React from 'react';
import PlayerSelector from './basic/PlayerSelector';
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

const DEFENSIVE = "Defensive"
const DEFENSIVE_MIDDLE = "Defensive Middle"
const OFFENSIVE_MIDDLE = "Offensive Middle"
const OFFENSIVE = "Offensive"


export default function ShortPass({
  offenseTeam,
  taggingState,
  offenseTeamId,
}) {

  const [actionTypeId, setActionTypeId] = React.useState(3);
  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [inTheBox, setInTheBox] = React.useState("No")

  const targetClicked = (target) => {
    if (target === "No") {
      taggingState([{
        action_type_id: actionTypeId,
        team_id: offenseTeamId,
        player_id: offensivePlayer.id,
        action_id: 1,
        action_result_id: 2
      }])
    } else if (target === "Yes") {
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
  }

  return (
    <>

      {actionTypeId && (actionTypeId === 1 || actionTypeId === 4) &&
        <SubBox>
          <List header="In The Box">
            {
              ["Yes", "No"].map((g, i) => (
                <ListItemButton key={i}
                  selected={inTheBox === g}
                  onClick={() => {
                    setInTheBox(g)
                    targetClicked(g)
                  }}
                >
                  <ListItemText primary={g} />
                </ListItemButton>
              ))
            }
          </List>
        </SubBox>
      }

      <SubBox>
        <List header="Area">
          {[
            { id: 1, name: DEFENSIVE },
            { id: 2, name: DEFENSIVE_MIDDLE },
            { id: 3, name: OFFENSIVE_MIDDLE },
            { id: 4, name: OFFENSIVE },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={actionTypeId === r.id}
              onClick={() => {
                setActionTypeId(r.id)
                if (r.name === DEFENSIVE_MIDDLE || r.name === OFFENSIVE_MIDDLE) {
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
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))
          }
        </List>
      </SubBox>

      <PlayerSelector
        title="List of Players"
        playerList={offenseTeam}
        editable={false}
        selected={offensivePlayer}
        onSelect={(player) => setOffensivePlayer(player)}
      />
    </>
  );
} 