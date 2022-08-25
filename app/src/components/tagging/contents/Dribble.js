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
  { id: 4, name: "Successful" },
  { id: 10, name: "Unsuccessful" },
  { id: 16, name: "Draw Foul" },
  { id: 17, name: "Stolen By" },
  { id: 15, name: "Deflected By" },
]

const FOUL_RESULT_LIST = [
  { id: 13, name: "Free Kick" },
  { id: 14, name: "Penalty" },
]

export default function Dribble({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

  const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
  const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
  const [actionTypeId, setActionTypeId] = React.useState(1);
  const [foulTypeId, setFoulTypeId] = React.useState(8);
  const [result, setResult] = React.useState(RESULT_LIST[0]);
  const [foulResult, setFoulResult] = React.useState(FOUL_RESULT_LIST[0]);
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
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
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
              onClick={() => {
                setResult(r)
                if (r.name !== "Draw Foul" && r.name !== "Stolen By" && r.name !== "Deflected By")
                  taggingState([
                    {
                      action_type_id: actionTypeId,
                      team_id: offenseTeamId,
                      player_id: offensivePlayer.id,
                      action_id: 4, //Dribble
                      action_result_id: r.id,
                      court_area_id: areaCourtId,
                      inside_the_paint: inTheBox
                    },
                  ])
              }}
            >
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>
      </SubBox>
      {
        result.name === "Stolen By" &&
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
                action_id: 4, // Dribble
                action_result_id: result.id,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
              {
                action_type_id: actionTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 12, // Tackle
                action_result_id: result.id,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
            ])
          }}
        />
      }
      {
        result.name === "Deflected By" &&
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
                action_id: 4,
                action_result_id: 19,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
              {
                action_type_id: actionTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 14,
                action_result_id: 19,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
            ])
          }}
        />
      }
      {
        result.name === "Draw Foul" &&
        <>
          <SubBox>
            <List header="Foul Type">
              {[
                { id: 8, name: "Regular" },
                { id: 9, name: "Yellow Card" },
                { id: 10, name: "Red Card" },
              ].map((type, i) => (
                <ListItemButton key={i}
                  selected={foulTypeId === type.id}
                  onClick={() => setFoulTypeId(type.id)}
                >
                  <ListItemText primary={type.name} />
                </ListItemButton>
              ))}
            </List>
          </SubBox>
          <SubBox>
            <List header="Foul Result">
              {FOUL_RESULT_LIST.map((r, i) => (
                <ListItemButton key={r.id}
                  selected={foulResult === r}
                  onClick={() => {
                    setFoulResult(r)
                  }}
                >
                  <ListItemText primary={r.name} />
                </ListItemButton>
              ))}
            </List>
          </SubBox>
        </>
      }
      {
        result.name === "Draw Foul" &&
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
                action_id: 4, //Dribble
                action_result_id: result.id,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
              {
                action_type_id: foulTypeId,
                team_id: offenseTeamId,
                player_id: offensivePlayer.id,
                action_id: 6, //Draw Foul
                action_result_id: foulResult.id,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
              {
                action_type_id: foulTypeId,
                team_id: defenseTeamId,
                player_id: player.id,
                action_id: 5, //Foul 
                action_result_id: foulResult.id,
                court_area_id: areaCourtId,
                inside_the_paint: inTheBox
              },
            ])
          }}
        />
      }
    </>
  );
}