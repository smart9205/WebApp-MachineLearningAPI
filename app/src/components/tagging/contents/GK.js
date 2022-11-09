import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from './basic/ModalList';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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

export default function GK({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId, defenseTeamGoalKeeper }) {
    const [actionTypeId, setActionTypeId] = useState(7);
    const [defensivePlayer, setDefensivePlayer] = React.useState(defenseTeam[0]);
    const [offensivePlayer, setOffensivePlayer] = React.useState(offenseTeam[0]);

    const [result, setResult] = React.useState();
    const [areaCourtId, setAreaCourtId] = useState(4);
    const [inTheBox, setInTheBox] = useState('No');

    return (
        <>
            <AreaCourtMenu areaCourtId={areaCourtId} setAreaCourtId={setAreaCourtId} inTheBox={inTheBox} setInTheBox={setInTheBox} />

            <PlayerSelector title="Goalkeepers" playerList={defenseTeamGoalKeeper} editable={false} selected={defensivePlayer} onSelect={(player) => setDefensivePlayer(player)} />

            <SubBox>
                <List header="Type">
                    {[
                        { id: 18, name: 'Air Challenge' },
                        { id: 19, name: 'Ground Challenge' },
                        { id: 20, name: 'One vs One' },
                    ].map((type, i) => (
                        <ListItemButton key={i} selected={actionTypeId === type.id} onClick={() => setActionTypeId(type.id)}>
                            <ListItemText primary={type.name} />
                        </ListItemButton>
                    ))}
                </List>
            </SubBox>

            <SubBox>
                <List header="Result">
                    {[
                        { id: 4, name: 'Successful' },
                        { id: 10, name: 'Unsuccessful' }
                    ].map((r, i) => (
                        <ListItemButton
                            key={r.id}
                            selected={result === r}
                            onClick={() => {
                                setResult(r);
                                if(actionTypeId === 18){
                                    if (r.name === 'Successful') {
                                        taggingState([
                                            {
                                                action_type_id: actionTypeId,
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
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
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
                                                action_result_id: r.id,
                                                court_area_id: areaCourtId,
                                                inside_the_paint: inTheBox
                                            }
                                        ]);
                                    }
                                }
                                if(actionTypeId === 19){
                                    if (r.name === 'Successful') {
                                        taggingState([
                                            {
                                                action_type_id: actionTypeId,
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
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
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
                                                action_result_id: r.id,
                                                court_area_id: areaCourtId,
                                                inside_the_paint: inTheBox
                                            }
                                        ]);
                                    }
                                }
                                if(actionTypeId === 20){
                                    if (r.name === 'Successful') {
                                        taggingState([
                                            {
                                                action_type_id: actionTypeId,
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
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
                                                team_id: defenseTeamId,
                                                player_id: defensivePlayer.id,
                                                action_id: actionTypeId,
                                                action_result_id: r.id,
                                                court_area_id: areaCourtId,
                                                inside_the_paint: inTheBox
                                            }
                                        ]);
                                    }
                                }
                            }}
                        >
                            <ListItemText primary={r.name} />
                        </ListItemButton>
                    ))}
                </List>
            </SubBox>

        </>
    );
}
