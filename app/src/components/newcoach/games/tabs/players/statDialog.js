import { Box, Button, CircularProgress, Dialog, DialogContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MatchAll from '../../../../../assets/match_all.png';
import MatchGrey from '../../../../../assets/match_grey.png';
import MatchFirst from '../../../../../assets/match_first.png';

import { USER_IMAGE_DEFAULT } from '../../../../../common/staticData';
import { getFormattedDate } from '../../../components/utilities';
import GameService from '../../../../../services/game.service';

const statList = [
    { id: 'goal', title: 'Goals' },
    { id: 'shot', title: 'Shots' },
    { id: 'penalties', title: 'Penalties' },
    { id: 'penalties_missed', title: 'Penalties Missed' },
    { id: 'shot_on_target', title: 'Shots On Target' },
    { id: 'shot_off_target', title: 'Shots Off Target' },
    { id: 'shot_on_box', title: 'Shots In The Box' },
    { id: 'shot_out_of_box', title: 'Shots Out Of The Box' },
    { id: 'dribble', title: 'Dribbles' },
    { id: 'dribble_successful', title: 'Successful Dribbles' },
    { id: 'crosses', title: 'Crosses' },
    { id: 'free_kick', title: 'Free Kicks' },
    { id: 'passes', title: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes' },
    { id: 'passes_for_shots', title: 'Passes For Shots' },
    { id: 'key_passes', title: 'Key Passes' },
    { id: 'through_passes', title: 'Through Passes' },
    { id: 'turnover', title: 'Turnovers' },
    { id: 'offside', title: 'Offsides' },
    { id: 'draw_fouls', title: 'Draw Fouls' },
    { id: 'tackle', title: 'Tackles' },
    { id: 'interception', title: 'Interceptions' },
    { id: 'saved', title: 'Saved' },
    { id: 'clearance', title: 'Clearance' },
    { id: 'fouls', title: 'Fouls' },
    { id: 'yellow_cards', title: 'Yellow Cards' },
    { id: 'red_cards', title: 'Red Cards' }
];

const GamePlayerStatDialog = ({ open, onClose, player, game, teamId, initialState }) => {
    const [playerState, setPlayerState] = useState(null);
    const [gameHalf, setGameHalf] = useState(['first']);
    const [gameTime, setGameTime] = useState(['1', '2', '3']);
    const [loading, setLoading] = useState(false);

    const handleChangeGameHalf = (e, newHalf) => {
        setGameHalf(newHalf);

        if (newHalf.includes('first') && newHalf.includes('second')) setGameTime(['1', '2', '3', '4', '5', '6']);
        else {
            if (newHalf.includes('first')) setGameTime(['1', '2', '3']);
            else if (newHalf.includes('second')) setGameTime(['4', '5', '6']);
        }
    };

    const handleChangeGameTime = (e, newTime) => {
        setGameTime(newTime);
    };

    const handlePlayerStat = () => {
        setLoading(true);
        GameService.getPlayersStatsAdvanced({
            seasonId: game.season_id,
            leagueId: `${game.league_id}`,
            gameId: `${game.id}`,
            teamId: `${teamId}`,
            playerId: `${player.player_id}`,
            gameTime: gameTime.join(','),
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null
        }).then((res) => {
            setPlayerState(res[0]);
            setLoading(false);
        });
    };

    useEffect(() => {
        setPlayerState(initialState);
    }, [initialState]);

    console.log(playerState);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="1500px">
            <DialogContent style={{ padding: '16px', display: 'flex', gap: '24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Box sx={{ border: '1px solid #E8E8E8', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', borderRadius: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>PROFILE</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '420px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '120px', height: '120px' }}>
                                <img src={player?.image ? player?.image : USER_IMAGE_DEFAULT} style={{ borderRadius: '12px', height: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>First name</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.first_name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Last name</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.last_name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Jersey Number</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.jersey_number ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Position</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Birth date</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>
                                        {getFormattedDate(player?.date_of_birth ?? '1970-01-01')}
                                    </Typography>
                                </div>
                            </div>
                        </Box>
                    </Box>
                    <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>FILTERS</Typography>
                            <Button variant="outlined" onClick={() => handlePlayerStat()}>
                                Recalculate
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>MATCH PERIOD</Typography>
                            <div style={{ width: '100%' }}>
                                <ToggleButtonGroup color="success" fullWidth size="small" value={gameHalf} onChange={handleChangeGameHalf}>
                                    <ToggleButton value="first">1 HALF</ToggleButton>
                                    <ToggleButton value="second">2 HALF</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup color="success" fullWidth size="small" value={gameTime} onChange={handleChangeGameTime}>
                                    <ToggleButton value="1">1-15'</ToggleButton>
                                    <ToggleButton value="2">16-30'</ToggleButton>
                                    <ToggleButton value="3">31-45'+</ToggleButton>
                                    <ToggleButton value="4">46-60'</ToggleButton>
                                    <ToggleButton value="5">61-75'</ToggleButton>
                                    <ToggleButton value="6">76-90'+</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', height: '120px' }}>
                            <img src={MatchAll} style={{ borderRadius: '12px', height: '100%' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>GAME RESULT</Typography>
                                    <div style={{ width: '100%', border: '1px solid grey', background: 'lightgrey', display: 'flex', alignItems: 'center', height: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Won</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Draw</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Lose</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>GAME PLACE</Typography>
                                    <div style={{ width: '100%', border: '1px solid grey', background: 'lightgrey', display: 'flex', alignItems: 'center', height: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Home</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Away</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>PLAYER STATS</Typography>
                    {loading ? (
                        <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '8px' }}>
                            {statList.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        padding: '6px 0',
                                        width: '160px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        border: '1px solid #E8E8E8',
                                        background: playerState ? (playerState[`total_${item.id}`] > 0 ? '#F2F7F2' : 'white') : 'white'
                                    }}
                                >
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>
                                        {playerState ? playerState[`total_${item.id}`] : ''}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default GamePlayerStatDialog;
