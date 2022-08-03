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

  const [actionTypeId, setActionTypeId] = React.useState(4);
  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [inTheBox, setInTheBox] = React.useState("No")
  const [selectedPlayer, setSelectedPlayer] = React.useState({})

  React.useEffect(() => {
    const playerData = localStorage.getItem('PlayerSelected')
    setSelectedPlayer(JSON.parse(playerData))
  }, [offensivePlayer])

  const tagData = {
    action_type_id: actionTypeId
  }

  const PlayerClicked = (player) => {
    setOffensivePlayer(player)
    localStorage.setItem('PlayerSelected', JSON.stringify(player))
    taggingState([{
      ...tagData,
      team_id: offenseTeamId,
      player_id: player.id,
      action_type_id: 4,
      action_id: 2,
      court_area_id: actionTypeId && actionTypeId === 2 ? 2 : 4,
      inside_the_paint: false
    }])
  }

  const targetClicked = (target) => {
    if (target === "No") {
      taggingState([{
        action_type_id: actionTypeId,
        team_id: offenseTeamId,
        player_id: selectedPlayer.id,
        action_id: 2,
        action_result_id: 3,
        court_area_id: actionTypeId && actionTypeId === 1 ? 1 : 3,
        inside_the_paint: false
      }])
    } else if (target === "Yes") {
      taggingState([
        {
          action_type_id: actionTypeId,
          team_id: offenseTeamId,
          player_id: selectedPlayer.id,
          action_id: 2,
          action_result_id: 3,
          court_area_id: actionTypeId && actionTypeId === 1 ? 1 : 3,
          inside_the_paint: true
        }
      ])
    }
  }

  return (
    <>
      <SubBox>
        <List header="Area">
          {[
            { id: 1, name: OFFENSIVE },
            { id: 2, name: OFFENSIVE_MIDDLE },
            { id: 3, name: DEFENSIVE },
            { id: 4, name: DEFENSIVE_MIDDLE },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={actionTypeId === r.id}
              onClick={() => {
                setActionTypeId(r.id)
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))
          }
        </List>
      </SubBox>

      {
        actionTypeId && (actionTypeId === 1 || actionTypeId === 3) &&
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

      <PlayerSelector
        title="List of Players"
        playerList={offenseTeam}
        editable={false}
        selected={selectedPlayer}
        onSelect={(player) => {
          PlayerClicked(player)
        }}

      />
    </>
  );
} 