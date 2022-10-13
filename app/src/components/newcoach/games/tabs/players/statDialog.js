import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MatchAll from '../../../../../assets/match_all.png';
import MatchGrey from '../../../../../assets/match_grey.png';
import MatchFirst from '../../../../../assets/match_first.png';

import { USER_IMAGE_DEFAULT } from '../../../../../common/staticData';
import { getFormattedDate } from '../../../components/utilities';

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

const GamePlayerStatDialog = ({ open, onClose, player, initialState }) => {
    const [playerState, setPlayerState] = useState(null);

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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>FILTERS</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>MATCH PERIOD</Typography>
                            <div style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', borderBottom: '1px solid #E8E8E8', height: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>1 HALF</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>2 HALF</Typography>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', cursor: 'pointer', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>1-15'</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', cursor: 'pointer', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>16-30'</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', cursor: 'pointer', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>31-45'+</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', cursor: 'pointer', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>46-60'</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, borderRight: '1px solid #E8E8E8', cursor: 'pointer', height: '100%' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>61-75'</Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>76-90'+</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', height: '120px' }}>
                            <img src={MatchAll} style={{ borderRadius: '12px', height: '100%' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '6px 0' }}>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>MATCH SITUATION</Typography>
                                    <div style={{ width: '100%', border: '1px solid grey', background: 'lightblue', display: 'flex', alignItems: 'center', height: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer', borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>Winning</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer', borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>Draw</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>Losing</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>MATCH SIDE</Typography>
                                    <div style={{ width: '100%', border: '1px solid grey', background: 'lightblue', display: 'flex', alignItems: 'center', height: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer', borderRight: '1px solid grey', height: '100%' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>Home</Typography>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, cursor: 'pointer' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>Away</Typography>
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
                                    border: '1px solid #E8E8E8'
                                }}
                            >
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>
                                    {playerState ? playerState[`total_${item.id}`] : ''}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default GamePlayerStatDialog;
