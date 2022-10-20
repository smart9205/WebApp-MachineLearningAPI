import React, { useState } from "react";
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

export default function Others({ defenseTeam, offenseTeam, taggingState, offenseTeamId, defenseTeamId }) {

    const [actionTypeId, setActionTypeId] = useState(7);
    const [areaCourtId, setAreaCourtId] = useState(4);
    const [inTheBox, setInTheBox] = useState("No")

    return (
        <>
            <AreaCourtMenu areaCourtId={areaCourtId} setAreaCourtId={setAreaCourtId} inTheBox={inTheBox} setInTheBox={setInTheBox} />

            <SubBox>
                <List header="Type">
                    {[
                        { id: 10, name: "Red Card" },
                        { id: 9, name: "Yellow Card" },
                        { id: 7, name: "Clearance" },
                        { id: 8, name: "Offensive Foul" },
                        { id: 13, name: "Hand-Ball" },
                        { id: 16, name: "Own Goal" },
                    ].map((r, i) => (
                        <ListItemButton key={r.id}
                            selected={actionTypeId === r.id}
                            onClick={() => { setActionTypeId(r.id) }}
                        >
                            <ListItemText primary={r.name} />
                        </ListItemButton>
                    ))}
                </List>
            </SubBox>

            {(actionTypeId === 10 || actionTypeId === 9) &&
                <>
                    <PlayerSelector
                        title="Offensive Player List"
                        playerList={offenseTeam}
                        editable={false}
                        onSelect={(player) => {
                            taggingState([
                                {
                                    action_type_id: actionTypeId,
                                    team_id: offenseTeamId,
                                    player_id: player.id,
                                    action_id: 5,
                                    action_result_id: inTheBox === "No" ? 13 : 14,
                                    court_area_id: areaCourtId,
                                    inside_the_paint: inTheBox
                                },
                            ])
                        }}
                    />
                    <PlayerSelector
                        title="Defensive Player List"
                        playerList={defenseTeam}
                        editable={false}
                        onSelect={(player) => {
                            taggingState([
                                {
                                    action_type_id: actionTypeId,
                                    team_id: defenseTeamId,
                                    player_id: player.id,
                                    action_id: 5,
                                    action_result_id: inTheBox === "No" ? 13 : 14,
                                    court_area_id: areaCourtId,
                                    inside_the_paint: inTheBox
                                },
                            ])
                        }}
                    />
                </>
            }

            {(actionTypeId === 13) &&
                <>
                    <PlayerSelector
                        title="Offensive Player List"
                        playerList={offenseTeam}
                        editable={false}
                        onSelect={(player) => {
                            taggingState([
                                {
                                    action_type_id: inTheBox === "No" ? 8 : actionTypeId,
                                    team_id: offenseTeamId,
                                    player_id: player.id,
                                    action_id: 15,
                                    action_result_id: inTheBox === "No" ? 13 : 14,
                                    court_area_id: areaCourtId,
                                    inside_the_paint: inTheBox
                                },
                            ])
                        }}
                    />
                    <PlayerSelector
                        title="Defensive Player List"
                        playerList={defenseTeam}
                        editable={false}
                        onSelect={(player) => {
                            taggingState([
                                {
                                    action_type_id: inTheBox === "No" ? 8 : actionTypeId,
                                    team_id: defenseTeamId,
                                    player_id: player.id,
                                    action_id: 15,
                                    action_result_id: inTheBox === "No" ? 13 : 14,
                                    court_area_id: areaCourtId,
                                    inside_the_paint: inTheBox
                                },
                            ])
                        }}
                    />
                </>
            }


            {actionTypeId === 8 &&
                <PlayerSelector
                    title="Offensive Player List"
                    playerList={offenseTeam}
                    editable={false}
                    onSelect={(player) => {
                        taggingState([
                            {
                                action_type_id: actionTypeId,
                                team_id: offenseTeamId,
                                player_id: player.id,
                                action_id: 5,
                                action_result_id: 13,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            },
                        ])
                    }}
                />
            }

            {actionTypeId === 7 &&
                <PlayerSelector
                    title="Defensive Player List"
                    playerList={defenseTeam}
                    editable={false}
                    onSelect={(player) => {
                        taggingState([
                            {
                                action_type_id: actionTypeId,
                                team_id: defenseTeamId,
                                player_id: player.id,
                                action_id: 11,
                                action_result_id: 8,
                                court_area_id: areaCourtId === 1 ? 4 : areaCourtId === 2 ? 3 : areaCourtId === 3 ? 2 : areaCourtId === 4 ? 1 : areaCourtId,
                                inside_the_paint: inTheBox
                            },
                        ])
                    }}
                />
            }

            {actionTypeId === 16 &&
                <PlayerSelector
                    title="Defensive Player List"
                    playerList={defenseTeam}
                    editable={false}
                    onSelect={(player) => {
                        taggingState([
                            {
                                action_type_id: 8,
                                team_id: defenseTeamId,
                                player_id: player.id,
                                action_id: 16,
                                action_result_id: 3,
                                court_area_id: areaCourtId,
                                inside_the_paint: inTheBox
                            },
                        ])
                    }}
                />
            }

        </>
    )
}