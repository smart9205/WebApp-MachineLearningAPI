import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from './basic/ModalList';
import PlayerSelector from './basic/PlayerSelector';
import AreaCourtMenu from './AreaCourtMenu';

const SubBox = styled(Box)`
    margin: 6px;
    margin-top: 80px;
    & nav {
        padding: 6px;
        border-radius: 6px;
    }
`;

const RESULT_LIST = [
    { id: 4, name: 'Successful' },
    { id: 10, name: 'Unsuccessful' },
    { id: 7, name: 'Blocked By' },
    { id: 8, name: 'Cleared By' },
    { id: 15, name: 'Offside' },
    { id: 18, name: 'Air Challenge' },
    { id: 19, name: 'Ground Challenge' }
];

export default function Cross({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId, defenseTeamGoalKeeper }) {
    const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);
    const [offsidePlayer, setOffsidePlayer] = React.useState(offenseTeam[0]);
    const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
    const [actionTypeId, setActionTypeId] = React.useState(1);
    const [result, setResult] = React.useState(RESULT_LIST[0]);
    const [areaCourtId, setAreaCourtId] = React.useState(4);
    const [inTheBox, setInTheBox] = React.useState('No');

    return (
        <>
            <AreaCourtMenu areaCourtId={areaCourtId} setAreaCourtId={setAreaCourtId} inTheBox={inTheBox} setInTheBox={setInTheBox} />
            <PlayerSelector title="Offensive Player List" playerList={offenseTeam} editable={false} selected={offensivePlayer} onSelect={(player) => setOffensivePlayer(player)} />
            <SubBox>
                <List header="Type">
                    {[
                        { id: 1, name: 'Right' },
                        { id: 2, name: 'Left' },
                        { id: 11, name: 'Free Kick' },
                        { id: 12, name: 'Corner' }
                    ].map((type, i) => (
                        <ListItemButton key={i} selected={actionTypeId === type.id} onClick={() => setActionTypeId(type.id)}>
                            <ListItemText primary={type.name} />
                        </ListItemButton>
                    ))}
                </List>
            </SubBox>
            <SubBox>
                <List header="Result">
                    {RESULT_LIST.map((r, i) => (
                        <ListItemButton
                            key={r.id}
                            selected={result === r}
                            onClick={() => {
                                setResult(r);
                                if (r.name === 'Successful') {
                                    taggingState([
                                        {
                                            action_type_id: actionTypeId,
                                            team_id: offenseTeamId,
                                            player_id: offensivePlayer.id,
                                            action_id: 3,
                                            action_result_id: r.id,
                                            court_area_id: areaCourtId,
                                            inside_the_paint: inTheBox
                                        }
                                    ]);
                                }
                                if (r.name === 'Unsuccessful') {
                                    taggingState([
                                        {
                                            action_type_id: actionTypeId,
                                            team_id: offenseTeamId,
                                            player_id: offensivePlayer.id,
                                            action_id: 3,
                                            action_result_id: r.id,
                                            court_area_id: areaCourtId,
                                            inside_the_paint: inTheBox
                                        }
                                    ]);
                                }
                            }}
                        >
                            <ListItemText primary={r.name} />
                        </ListItemButton>
                    ))}
                </List>
            </SubBox>

            {result.name === 'Air Challenge' && (
                <PlayerSelector
                    title="Defensive Player List"
                    playerList={defenseTeamGoalKeeper}
                    editable={false}
                    selected={defensivePlayer}
                    onSelect={(player) => {
                        setDefensivePlayer(player);
                        taggingState([
                            {
                                action_type_id: actionTypeId,
                                team_id: defenseTeamId,
                                player_id: player.id,
                                action_id: 18,
                                action_result_id: 4,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            },
                            {
                                action_type_id: actionTypeId,
                                player_id: offensivePlayer.id,
                                team_id: offenseTeamId,
                                action_id: 3,
                                action_result_id: 4,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            }
                        ]);
                    }}
                />
            )}
            
            {result.name === 'Ground Challenge' && (
                <PlayerSelector
                    title="Defensive Player List"
                    playerList={defenseTeamGoalKeeper}
                    editable={false}
                    selected={defensivePlayer}
                    onSelect={(player) => {
                        setDefensivePlayer(player);
                        taggingState([
                            {
                                action_type_id: actionTypeId,
                                team_id: defenseTeamId,
                                player_id: player.id,
                                action_id: 19,
                                action_result_id: 4,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            },
                            {
                                action_type_id: actionTypeId,
                                player_id: offensivePlayer.id,
                                team_id: offenseTeamId,
                                action_id: 3,
                                action_result_id: 4,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            }
                        ]);
                    }}
                />
            )}

            {result.name === 'Offside' ? (
                <PlayerSelector
                    title="Offensive Player List"
                    playerList={offenseTeam}
                    editable={false}
                    selected={offsidePlayer}
                    onSelect={(player) => {
                        setOffsidePlayer(player);
                        taggingState([
                            {
                                action_type_id: actionTypeId,
                                team_id: offenseTeamId,
                                player_id: offensivePlayer.id,
                                action_id: 3, //cross
                                action_result_id: result.id,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            },
                            {
                                action_type_id: actionTypeId,
                                team_id: defenseTeamId,
                                player_id: player.id,
                                action_id: 7, //Turnover
                                action_result_id: result.id,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            }
                        ]);
                    }}
                />
            ) : (
                result.name !== 'Ground Challenge' &&
                result.name !== 'Air Challenge' &&
                result.name !== 'Successful' &&
                result.name !== 'Unsuccessful' && (
                    <PlayerSelector
                        title="Defensive Player List"
                        playerList={defenseTeam}
                        editable={false}
                        selected={defensivePlayer}
                        onSelect={(player) => {
                            setDefensivePlayer(player);

                            if (result.name === 'Blocked By')
                                taggingState([
                                    {
                                        action_type_id: actionTypeId,
                                        team_id: offenseTeamId,
                                        player_id: offensivePlayer.id,
                                        action_id: 3, //cross
                                        action_result_id: result.id,
                                        court_area_id: areaCourtId,
                                        inside_the_paint: inTheBox
                                    },
                                    {
                                        action_type_id: actionTypeId,
                                        team_id: defenseTeamId,
                                        player_id: player.id,
                                        action_id: 13, //interception
                                        action_result_id: result.id,
                                        court_area_id: areaCourtId === 1 ? 4 : areaCourtId === 2 ? 3 : areaCourtId === 3 ? 2 : areaCourtId === 4 ? 1 : areaCourtId,
                                        inside_the_paint: inTheBox
                                    }
                                ]);

                            if (result.name === 'Cleared By')
                                taggingState([
                                    {
                                        action_type_id: actionTypeId,
                                        team_id: offenseTeamId,
                                        player_id: offensivePlayer.id,
                                        action_id: 3, //cross
                                        action_result_id: result.id,
                                        court_area_id: areaCourtId,
                                        inside_the_paint: inTheBox
                                    },
                                    {
                                        action_type_id: actionTypeId,
                                        team_id: defenseTeamId,
                                        player_id: player.id,
                                        action_id: 11, //clearance
                                        action_result_id: result.id,
                                        court_area_id: areaCourtId === 1 ? 4 : areaCourtId === 2 ? 3 : areaCourtId,
                                        inside_the_paint: inTheBox
                                    }
                                ]);
                        }}
                    />
                )
            )}
        </>
    );
}
