import React, { useEffect, useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';

import { PLAYER_ICON_DEFAULT } from '../../../../common/staticData';
import { getComparator, stableSort } from '../../components/utilities';

const headCells = [
    {
        id: 'total_player_games',
        title: 'Games'
    },
    {
        id: 'total_goal',
        title: 'Goals'
    },
    {
        id: 'total_shot',
        title: 'Shots'
    },
    {
        id: 'total_dribble',
        title: 'Dribbles'
    },
    {
        id: 'total_crosses',
        title: 'Crosses'
    },
    {
        id: 'total_free_kick',
        title: 'Free Kicks'
    },
    {
        id: 'total_passes',
        title: 'Passes'
    },
    {
        id: 'total_turnover',
        title: 'Turnovers'
    },
    {
        id: 'total_draw_fouls',
        title: 'Draw Fouls'
    },
    {
        id: 'total_interception',
        title: 'Interceptions'
    },
    {
        id: 'total_tackle',
        title: 'Tackles'
    },
    {
        id: 'total_saved',
        title: 'Saved'
    },
    {
        id: 'total_clearance',
        title: 'Clearance'
    }
];

const TeamPlayers = ({ playerList, stats }) => {
    const [playerIds, setPlayerIds] = useState([]);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');

    const getPlayerStatus = (id) => {
        if (stats.length > 0) return stats.filter((item) => item.player_id === id)[0];

        return null;
    };

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'desc';

        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(prop);
    };

    const getSortedArray = () => {
        const newStats = stableSort(stats, getComparator(order, orderBy));
        const other = playerList.filter((item) => !playerIds.includes(item.id));
        let newList = [];

        newStats.map((item) => {
            const newItem = playerList.filter((data) => data.id === item.player_id)[0];

            newList = [...newList, newItem];

            return newList;
        });
        other.map((item) => {
            newList = [...newList, item];

            return newList;
        });

        return newList;
    };

    useEffect(() => {
        if (stats.length > 0) setPlayerIds(stats.map((item) => item.player_id));
    }, [playerList, stats]);

    console.log('teams/players => ', order, orderBy, playerList);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', minHeight: '65vh', overflowY: 'auto', display: 'flex', padding: '24px' }}>
            <TableContainer sx={{ maxHeight: '80vh' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="none" />
                            <TableCell key="name" align="center">
                                Name
                            </TableCell>
                            <TableCell key="pos" align="center">
                                Position
                            </TableCell>
                            {headCells.map((cell) => (
                                <TableCell key={cell.id} align="center" sortDirection={orderBy === cell.id ? order : false}>
                                    <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => handleRequestSort(cell.id)}>
                                        {cell.title}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getSortedArray().map((player, index) => (
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
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_player_games'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_goal'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_shot'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_dribble'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_crosses'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_free_kick'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_passes'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_turnover'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_draw_fouls'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_interception'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_tackle'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_saved'] : '-') : '-'}</TableCell>
                                <TableCell align="center">{playerIds.includes(player.id) ? (getPlayerStatus(player.id) ? getPlayerStatus(player.id)['total_clearance'] : '-') : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TeamPlayers;
