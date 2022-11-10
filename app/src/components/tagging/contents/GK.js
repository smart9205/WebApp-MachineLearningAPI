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

            <PlayerSelector title="Defensive Goalkeepers" playerList={defenseTeamGoalKeeper} editable={false} selected={defensivePlayer} onSelect={(player) => setDefensivePlayer(player)} />
            <SubBox>
                <List header="Type">
                    {[
                        { id: 18, name: 'Air Challenge' },
                        { id: 19, name: 'Ground Challenge' },
                        { id: 20, name: 'One vs One' }
                    ].map((r, i) => (
                        <ListItemButton
                            key={r.id}
                            selected={actionTypeId === r.id}
                            onClick={() => {
                                setActionTypeId(r.id);
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
                        { id: 4, name: 'Successful' },
                        { id: 10, name: 'Unsuccessful' }
                    ].map((r, i) => (
                        <ListItemButton
                            key={r.id}
                            selected={result?.id === r.id}
                            onClick={() => {
                                setResult(r);
                                const d = {
                                    action_type_id: 8,
                                    team_id: defenseTeamId,
                                    player_id: defensivePlayer.id,
                                    action_result_id: r.id,
                                    court_area_id: areaCourtId,
                                    inside_the_paint: inTheBox
                                };
                                if (r.name === 'Successful') taggingState([{ ...d, action_id: actionTypeId }]);
                                if (r.name === 'Unsuccessful') taggingState([{ ...d, action_id: actionTypeId }]);
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
