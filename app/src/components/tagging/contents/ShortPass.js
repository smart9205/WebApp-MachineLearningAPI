import * as React from 'react';
import PlayerSelector from './basic/PlayerSelector';
import AreaCourtMenu from './AreaCourtMenu';

export default function ShortPass({ offenseTeam, taggingState, offenseTeamId }) {
    const [areaCourtId, setAreaCourtId] = React.useState(4);
    const [inTheBox, setInTheBox] = React.useState('No');

    return (
        <>
            <AreaCourtMenu areaCourtId={areaCourtId} setAreaCourtId={setAreaCourtId} inTheBox={inTheBox} setInTheBox={setInTheBox} />

            <PlayerSelector
                title="List of Players"
                playerList={offenseTeam}
                editable={false}
                onSelect={(player) => {
                    taggingState([
                        {
                            team_id: offenseTeamId,
                            player_id: player.id,
                            action_type_id: 4,
                            action_result_id: 4,
                            action_id: 2,
                            court_area_id: areaCourtId,
                            inside_the_paint: inTheBox
                        }
                    ]);
                }}
            />
        </>
    );
}
