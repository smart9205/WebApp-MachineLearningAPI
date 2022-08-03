import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from "./basic/ModalList"
import PlayerSelector from './basic/PlayerSelector';
import AreaCourtMenu from './AreaCourtMenu';

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
  `;

const RESULT_LIST = [
  { id: 13, name: "Free Kick" },
  { id: 14, name: "Penalty" },
]


export default function Foul({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(8);
  const [result, setResult] = React.useState(RESULT_LIST[0]);
  const [areaCourtId, setAreaCourtId] = React.useState(4);
  const [inTheBox, setInTheBox] = React.useState("No")

  return (
    <>
      <AreaCourtMenu areaCourtId={areaCourtId} setAreaCourtId={setAreaCourtId} inTheBox={inTheBox} setInTheBox={setInTheBox} />
      <PlayerSelector
        title="Offensive Player List"
        playerList={offenseTeam}
        editable={false}
        selected={offensivePlayer}
        onSelect={(player) => setOffensivePlayer(player)}
      />

      <SubBox>
        <List header="Type">
          {[
            { id: 8, name: "Regular" },
            { id: 9, name: "Yellow Card" },
            { id: 10, name: "Red Card" },
          ].map((type, i) => (
            <ListItemButton key={i}
              selected={actionTypeId === type.id}
              onClick={() => setActionTypeId(type.id)}
            >
              <ListItemText primary={type.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <SubBox>
        <List header="Result">
          {RESULT_LIST.map((r, i) => (
            <ListItemButton key={r.id}
              selected={result === r}
              onClick={() => setResult(r)}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      <PlayerSelector
        title="Defensive Player List"
        playerList={defenseTeam}
        editable={false}
        selected={defensivePlayer}
        onSelect={(player) => {
          setDefensivePlayer(player)
          taggingState([
            {
              action_type_id: actionTypeId,
              team_id: offenseTeamId,
              player_id: offensivePlayer.id,
              action_id: 6, //Draw Foul
              action_result_id: result.id,
              court_area_id: areaCourtId,
              inside_the_paint: inTheBox
            },
            {
              action_type_id: actionTypeId,
              team_id: defenseTeamId,
              player_id: player.id,
              action_id: 5, //Foul 
              action_result_id: result.id,
              court_area_id: areaCourtId,
              inside_the_paint: inTheBox
            },
          ])
        }} />
    </>
  );
}