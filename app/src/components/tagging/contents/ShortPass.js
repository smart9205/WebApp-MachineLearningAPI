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

  const [areaCourtId, setAreaCourtId] = React.useState(4);
  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [inTheBox, setInTheBox] = React.useState("No")

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
              selected={areaCourtId === r.id}
              onClick={() => {
                setAreaCourtId(r.id)
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))
          }
        </List>
      </SubBox>

      {
        areaCourtId && (areaCourtId === 1 || areaCourtId === 3) &&
        <SubBox>
          <List header="In The Box">
            {
              ["Yes", "No"].map((g, i) => (
                <ListItemButton key={i}
                  selected={inTheBox === g}
                  onClick={() => {
                    setInTheBox(g)
                    // targetClicked(g)
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
        onSelect={(player) => {
          taggingState([{
            team_id: offenseTeamId,
            player_id: player.id,
            action_type_id: 4,
            action_result_id: 4,
            action_id: 2,
            court_area_id: areaCourtId,
            inside_the_paint: inTheBox
          }])
        }} />
    </>
  );
} 