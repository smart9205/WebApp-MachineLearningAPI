import React, { useEffect, useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { PLAYER_ICON_DEFAULT } from '../../../../common/staticData';

const TeamPlayers = ({ playerList, stats }) => {
    const [playerIds, setPlayerIds] = useState([]);

    const getPlayerStatus = (id) => {
        if (stats.length > 0) return stats.filter((item) => item.player_id === id)[0];

        return null;
    };

    useEffect(() => {
        if (stats.length > 0) setPlayerIds(stats.map((item) => item.player_id));
    }, [playerList, stats]);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', minHeight: '65vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ width: '100%', padding: '24px' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Position</TableCell>
                                <TableCell align="center">Games</TableCell>
                                <TableCell align="center">Goals</TableCell>
                                <TableCell align="center">Shots</TableCell>
                                <TableCell align="center">Dribbles</TableCell>
                                <TableCell align="center">Crosses</TableCell>
                                <TableCell align="center">Free Kicks</TableCell>
                                <TableCell align="center">Passes</TableCell>
                                <TableCell align="center">Turnovers</TableCell>
                                <TableCell align="center">Draw Fouls</TableCell>
                                <TableCell align="center">Interceptions</TableCell>
                                <TableCell align="center">Tackles</TableCell>
                                <TableCell align="center">Saved</TableCell>
                                <TableCell align="center">Clearance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {playerList &&
                                playerList.map((player, index) => (
                                    <TableRow key={index} height="70px">
                                        <TableCell width="5%" align="center">
                                            <img style={{ height: '48px' }} alt="Player Logo" src={player.image.length > 0 ? player.image : PLAYER_ICON_DEFAULT} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ paddingLeft: '16px' }}>
                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player.name}</Typography>
                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#a5a5a8' }}>#{player.jersey_number}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{player.pos_name}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_game'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_goal'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_shot'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_dribble'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_crosses'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_free_kick'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_passes'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_turnover'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">
                                            {playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_draw_fouls'] : '-') : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_interception'] : '-') : '-'}
                                        </TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_tackle'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_saved'] : '-') : '-'}</TableCell>
                                        <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_clearance'] : '-') : '-'}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default TeamPlayers;
