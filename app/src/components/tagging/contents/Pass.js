import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from "./basic/ModalList"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PlayerSelector from './basic/PlayerSelector';
import AreaCourtMenu from './AreaCourtMenu';

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
  `;

const SUCCESSFUL = "Successful"
const STOLE_BY = "Stole By"
const BLOCKED_BY = "Blocked By"
const BAD_PASS = "Bad Pass"
const OFFSIDE = "Offside"

const LONG_PASS = "Long Pass"
const THROUGH_PASS = "Through Pass"
const KEY_PASS = "Key Pass"
const SHORT_PASS = "Short Pass"
const THROW_IN = "Throw-In"
const FREE_KICK = "Free Kick"
const PASS_FOR_A_SHOT = "Pass For a Shot"
const CORNER = "Corner"
const ASSIST = "Assist"
const DIAGONAL = "Diagonal"

export default function Pass({
  defenseTeam,
  offenseTeam,
  taggingState,
  defenseTeamId,
  offenseTeamId,
}) {

  const [result, setResult] = React.useState({ id: 4, name: SUCCESSFUL })
  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [offsidePlayer, setOffsidePlayer] = React.useState({});
  const [defensivePlayer, setDefensivePlayer] = React.useState({});
  const [actionTypeId, setActionTypeId] = React.useState(5);
  const [areaCourtId, setAreaCourtId] = React.useState(4);
  const [inTheBox, setInTheBox] = React.useState("No")


  const tagData = {
    action_type_id: actionTypeId
  }

  const defensivePlayerClicked = (player) => {
    setDefensivePlayer(player)
    taggingState([{
      ...tagData,
      team_id: defenseTeamId,
      player_id: player.id,
      action_id: 10,
      action_result_id: 11, //Bad Pass
      court_area_id: areaCourtId,
      inside_the_paint: inTheBox
    }, {
      ...tagData,
      player_id: offensivePlayer.id,
      team_id: offenseTeamId,
      action_id: 2,
      action_result_id: 11, //Bad Pass
      court_area_id: areaCourtId,
      inside_the_paint: inTheBox
    }])
  }

  const defensivePlayerClickedBlockedBy = (player) => {
    setDefensivePlayer(player)
    taggingState([{
      ...tagData,
      team_id: defenseTeamId,
      player_id: player.id,
      action_id: 13,
      action_result_id: 7,  //Blocked
      court_area_id: areaCourtId,
      inside_the_paint: inTheBox
    }, {
      ...tagData,
      player_id: offensivePlayer.id,
      team_id: offenseTeamId,
      action_id: 2,
      action_result_id: 7,  //Blocked
      court_area_id: areaCourtId === 1 ? 4 : areaCourtId === 2 ? 3 : areaCourtId,
      inside_the_paint: inTheBox
    }])
  }

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
            { id: 5, name: LONG_PASS },
            { id: 6, name: THROUGH_PASS },
            { id: 7, name: KEY_PASS },
            { id: 4, name: SHORT_PASS },
            { id: 14, name: THROW_IN },
            { id: 11, name: FREE_KICK },
            { id: 15, name: PASS_FOR_A_SHOT },
            { id: 12, name: CORNER },
            { id: 16, name: DIAGONAL }
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={actionTypeId === r.id}
              onClick={() => {
                setActionTypeId(r.id)
                const d = {
                  ...tagData,
                  team_id: offenseTeamId,
                  player_id: offensivePlayer.id,
                  action_type_id: r.id,
                  court_area_id: areaCourtId,
                  inside_the_paint: inTheBox
                };
                if (r.name === KEY_PASS) taggingState([{ ...d, action_id: 2, action_result_id: 4, }])

              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>

      <SubBox>
        <List header="Result">
          {[
            { id: 4, name: SUCCESSFUL },
            { id: 5, name: STOLE_BY },
            { id: 7, name: BLOCKED_BY },
            { id: 11, name: BAD_PASS },
            { id: 15, name: OFFSIDE },
            { id: 9, name: ASSIST },
          ].map((r, i) => (
            <ListItemButton key={r.id}
              selected={result?.id === r.id}
              onClick={() => {
                setResult(r)
                const d = {
                  ...tagData,
                  team_id: offenseTeamId,
                  player_id: offensivePlayer.id,
                  action_result_id: r.id,
                  court_area_id: areaCourtId,
                  inside_the_paint: inTheBox
                };
                if (r.name === SUCCESSFUL) taggingState([{ ...d, action_id: 2, }])
                if (r.name === BAD_PASS) taggingState([{ ...d, action_id: 2, }])
                if (r.name === ASSIST) taggingState([{ ...d, action_id: r.id, action_result_id: 3, }])
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {(result.name === STOLE_BY) &&
        <PlayerSelector
          title="Defensive Player List"
          playerList={defenseTeam}
          editable={false}
          selected={defensivePlayer}
          onSelect={(player) => { defensivePlayerClicked(player) }}
        />
      }

      {(result.name === BLOCKED_BY) &&
        <PlayerSelector
          title="Defensive Player List"
          playerList={defenseTeam}
          editable={false}
          selected={defensivePlayer}
          onSelect={(player) => { defensivePlayerClickedBlockedBy(player) }}
        />
      }

      {
        result.name === OFFSIDE &&
        <PlayerSelector
          title="Offensive Player List"
          playerList={offenseTeam}
          editable={false}
          selected={offsidePlayer}
          onSelect={(player) => {
            setOffsidePlayer(player)
            taggingState([{
              ...tagData,
              team_id: offenseTeamId,
              player_id: offensivePlayer.id,
              action_id: 2,
              action_result_id: 15, // offside
              court_area_id: areaCourtId,
              inside_the_paint: inTheBox
            }, {
              ...tagData,
              team_id: offenseTeamId,
              player_id: player.id,
              action_id: 7,
              action_result_id: 15, //offside
              court_area_id: areaCourtId,
              inside_the_paint: inTheBox
            }])
          }}
        />
      }

    </>
  );
} 