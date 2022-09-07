import React from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { PLAYER_ICON_DEFAULT } from '../../../../common/staticData';

const TeamPlayers = ({ playerList }) => {
    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', minHeight: '65vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ width: '100%', padding: '24px' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="55%" align="center" colSpan={2}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Name</Typography>
                                </TableCell>
                                <TableCell width="15%" align="center">
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Age</Typography>
                                </TableCell>
                                <TableCell width="15%" align="center">
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Position</Typography>
                                </TableCell>
                                <TableCell width="15%" align="center">
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Games</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {playerList &&
                                playerList.map((player, index) => (
                                    <TableRow key={index} height="70px">
                                        <TableCell width="5%" align="center">
                                            <img style={{ height: '48px' }} alt="Player Logo" src={player.image.length > 0 ? player.image : PLAYER_ICON_DEFAULT} />
                                        </TableCell>
                                        <TableCell width="50%">
                                            <Box sx={{ paddingLeft: '16px' }}>
                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player.name}</Typography>
                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#a5a5a8' }}>#{player.jersey_number}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell width="15%" align="center">
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>-</Typography>
                                        </TableCell>
                                        <TableCell width="15%" align="center">
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{player.pos_name}</Typography>
                                        </TableCell>
                                        <TableCell width="15%" align="center">
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>-</Typography>
                                        </TableCell>
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
