import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import LeadersPlayerStatColumn from './playerStatColumn';

const Leaders = () => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        GameService.getPlayersStats(3, null, null, null, null).then((res) => {
            setPlayerList(res);
            setLoading(false);
        });
    }, []);

    console.log('leaders => ', playerList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Leaders</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="game" title="Games Player" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="goal" title="Goals" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="penalties" title="Penalties" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="penalties_missed" title="Penalties Missed" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="shot" title="Shots" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="shot_on_target" title="Shots On Target" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="shot_off_target" title="Shots Off Target" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="shot_on_box" title="Shots On Box" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="free_kick" title="Free Kicks" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="crosses" title="Crosses" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="dribble" title="Dribbles" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="dribble_successful" title="Dribbles Successful" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="passes" title="Passes" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="successful_passes" title="Passes Successful" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="passes_for_goals" title="Passes For Goals" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="passes_for_shots" title="Passes For Shots" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="key_passes" title="Key Passes" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="key_passes_successful" title="Key Passes Successful" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="through_passes" title="Through Passes" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="through_passes_successful" title="Through Passes Successful" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="offside" title="Offside" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="turnover" title="Turnovers" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="turnover_on_offensive_court" title="Turnovers on Offensive Court" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="turnover_on_defensive_court" title="Turnovers on Defensive Court" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="saved" title="Saved" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="tackle" title="Tackles" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="tackle_on_offensive_court" title="Tackles on Offensive Court" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="tackle_on_defensive_court" title="Tackles on Defensive Court" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="clearance" title="Clearance" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="interception" title="Interceptions" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="interception_on_offensive_court" title="Interceptions on Offensive Court" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="interception_on_defensive_court" title="Interceptions on Defensive Court" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="fouls" title="Fouls" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="draw_fouls" title="Draw Fouls" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="red_cards" title="Red Cards" />
                                <LeadersPlayerStatColumn list={playerList} isTotal={true} option="yellow_cards" title="Yellow Cards" />
                            </div>
                        </div>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Leaders;
