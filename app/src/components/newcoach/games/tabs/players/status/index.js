import { Box, Button, Dialog, DialogContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MatchAll from '../../../../../../assets/match_all.png';

import { USER_IMAGE_DEFAULT } from '../../../../../../common/staticData';
import { getFormattedDate } from '../../../../components/utilities';
import GameService from '../../../../../../services/game.service';
import GamePlayerStatErrorMessage from './errorMessage';

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

const GamePlayerStatDialog = ({ open, onClose, player, game, teamId, our, initialState }) => {
    const [playerState, setPlayerState] = useState(null);
    const [gameHalf, setGameHalf] = useState(['first', 'second']);
    const [gameTime, setGameTime] = useState(['1', '2', '3', '4', '5', '6']);
    const [loading, setLoading] = useState(false);
    const [courtArea, setCourtArea] = useState(['1', '2', '3', '4']);
    const [errorOpen, setErrorOpen] = useState(false);

    const handleChangeGameHalf = (e, newHalf) => {
        setGameHalf(newHalf);

        if (newHalf.length === 2) setGameTime(['1', '2', '3', '4', '5', '6']);
        else if (newHalf.length === 1) {
            if (newHalf.includes('first')) {
                let newList = [...gameTime];

                newList = newList.filter((item) => item === '4' || item === '5' || item === '6');

                if (newList.length === 3) newList = ['1', '2', '3'];
                else {
                    if (!newList.includes('1')) newList = [...newList, '1'];
                    if (!newList.includes('2')) newList = [...newList, '2'];
                    if (!newList.includes('3')) newList = [...newList, '3'];
                }

                setGameTime(newList);
            } else if (newHalf.includes('second')) {
                let newList = [...gameTime];

                newList = newList.filter((item) => item === '1' || item === '2' || item === '3');

                if (newList.length === 3) newList = ['4', '5', '6'];
                else {
                    if (!newList.includes('4')) newList = [...newList, '4'];
                    if (!newList.includes('5')) newList = [...newList, '5'];
                    if (!newList.includes('6')) newList = [...newList, '6'];
                }

                setGameTime(newList);
            }
        } else {
            if (e.target.innerText === '1 HALF') setGameTime(gameTime.filter((item) => item === '4' || item === '5' || item === '6'));
            else if (e.target.innerText === '2 HALF') setGameTime(gameTime.filter((item) => item === '1' || item === '2' || item === '3'));
        }
    };

    const handleChangeGameTime = (e, newTime) => {
        setGameTime(newTime);

        if (newTime.length === 6) setGameHalf(['first', 'second']);
        else if (newTime.length >= 0 && newTime.length <= 2) setGameHalf([]);
        else if (newTime.length >= 3 && newTime.length <= 5) {
            const diff1 = ['1', '2', '3'].filter((item) => !newTime.includes(item));
            const diff2 = ['4', '5', '6'].filter((item) => !newTime.includes(item));

            if (diff1.length === 0) setGameHalf(['first']);
            if (diff2.length === 0) setGameHalf(['second']);
            if (diff1.length !== 0 && diff2.length !== 0) setGameHalf([]);
        }
    };

    const handleChangeCourtArea = (courtId) => {
        let newList = [...courtArea];

        if (newList.includes(courtId)) newList = newList.filter((item) => item !== courtId);
        else newList = [...newList, courtId];

        setCourtArea(newList);
    };

    const handlePlayerStat = () => {
        if (gameTime.length === 0 || courtArea.length === 0) {
            setErrorOpen(true);

            return;
        }

        setLoading(true);
        GameService.getPlayersStatsAdvanced({
            seasonId: game.season_id,
            leagueId: game.league_id,
            gameId: game.id,
            teamId: teamId,
            playerId: player.player_id,
            gameTime: gameTime.join(','),
            courtAreaId: courtArea.join(','),
            insidePaint: null,
            homeAway: null,
            gameResult: null,
            our: our
        }).then((res) => {
            console.log(res);
            setPlayerState(res[0]);
            setLoading(false);
        });
    };

    useEffect(() => {
        setPlayerState(initialState);
        setGameHalf(['first', 'second']);
        setGameTime(['1', '2', '3', '4', '5', '6']);
        setCourtArea(['1', '2', '3', '4']);
    }, [initialState, open]);

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
                            <Button variant="outlined" color="success" sx={{ textTransform: 'none' }} onClick={() => handlePlayerStat()}>
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
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '120px',
                                    width: '220px',
                                    borderRadius: '12px',
                                    background: `url(${MatchAll}) center center / cover no-repeat silver`
                                }}
                            >
                                {['4', '3', '2', '1'].map((court, index) => (
                                    <div
                                        key={`${index}-${court}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            borderRadius: index === 0 ? '12px 0 0 12px' : index === 3 ? '0 12px 12px 0' : 0,
                                            height: '100%',
                                            cursor: 'pointer',
                                            background: courtArea.includes(court) ? 'rgba(200, 200, 200, 0)' : 'rgba(200, 200, 200, 0.7)',
                                            border: '1px solid white'
                                        }}
                                        onClick={() => handleChangeCourtArea(court)}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
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
                                    background: loading ? 'white' : playerState ? (playerState[`total_${item.id}`] > 0 ? '#F2F7F2' : 'white') : 'white'
                                }}
                            >
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>
                                    {!loading ? (playerState ? playerState[`total_${item.id}`] : '0') : '0'}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Box>
            </DialogContent>
            <GamePlayerStatErrorMessage open={errorOpen} onClose={() => setErrorOpen(false)} />
        </Dialog>
    );
};

export default GamePlayerStatDialog;
