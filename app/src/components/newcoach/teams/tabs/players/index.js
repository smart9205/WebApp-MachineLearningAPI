import React, { useEffect, useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';

import { PLAYER_ICON_DEFAULT } from '../../../../../common/staticData';
import { getComparator, stableSort } from '../../../components/utilities';
import GameService from '../../../../../services/game.service';
import TeamPlayerStatDialog from './status';

const headCells = [
    { id: 'total_player_games', title: 'Games' },
    { id: 'total_goal', title: 'Goals' },
    { id: 'total_shot', title: 'Shots' },
    { id: 'total_dribble', title: 'Dribbles' },
    { id: 'total_crosses', title: 'Crosses' },
    { id: 'total_corner', title: 'Corners' },
    { id: 'total_free_kick', title: 'Free Kicks' },
    { id: 'total_passes', title: 'Passes' },
    { id: 'total_turnover', title: 'Turnovers' },
    { id: 'total_fouls', title: 'Fouls' },
    { id: 'total_draw_fouls', title: 'Draw Fouls' },
    { id: 'total_interception', title: 'Interceptions' },
    { id: 'total_tackle', title: 'Tackles' },
    { id: 'total_saved', title: 'Saved' },
    { id: 'total_blocked', title: 'Blocked' },
    { id: 'total_clearance', title: 'Clearance' }
];

const TeamPlayersStats = ({ playerList, stats, teamId, seasonId, leagueId }) => {
    const [playerIds, setPlayerIds] = useState([]);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [statOpen, setStatOpen] = useState(false);
    const [playerStat, setPlayerStat] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

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
        if (playerList.length > 0 && stats.length > 0) {
            const sortedStats = stableSort(stats, getComparator(order, orderBy));
            const other = playerList.filter((item) => !playerIds.includes(item.id));
            const inside = playerList.filter((item) => playerIds.includes(item.id));
            let newList = [];

            console.log('#########', inside, other);

            if (sortedStats.length === inside.length) {
                sortedStats.map((item) => {
                    const newItem = playerList.filter((data) => data.id === item.player_id)[0];

                    newList = [...newList, newItem];

                    return newList;
                });
            } else {
                const newIds = inside.map((item) => item.id);
                const newStats = sortedStats.filter((item) => newIds.includes(item.player_id));

                newStats.map((item) => {
                    const newItem = inside.filter((data) => data.id === item.player_id)[0];

                    newList = [...newList, newItem];

                    return newList;
                });
            }
            other.map((item) => {
                newList = [...newList, item];

                return newList;
            });

            return newList;
        }

        return [];
    };

    const handleDisplayList = (player) => {
        GameService.getPlayersStatsAdvanced({
            seasonId: seasonId,
            leagueId: leagueId,
            gameId: null,
            teamId: teamId,
            playerId: player.id,
            gameTime: '1,2,3,4,5,6',
            courtAreaId: '1,2,3,4',
            insidePaint: null,
            homeAway: null,
            gameResult: null
        }).then((res) => {
            setCurrentPlayer(player);
            setPlayerStat(res[0]);
            setStatOpen(true);
        });
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
                                <TableCell width="5%" align="center" sx={{ cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                    <img style={{ height: '48px' }} alt="Player Logo" src={player ? (player.image.length > 0 ? player.image : PLAYER_ICON_DEFAULT) : PLAYER_ICON_DEFAULT} />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ paddingLeft: '16px', cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player?.name ?? '-'}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#a5a5a8' }}>#{player?.jersey_number ?? 0}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{player?.pos_name ?? '-'}</TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_player_games'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_goal'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_shot'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_dribble'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_crosses'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_corner'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_free_kick'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_passes'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_turnover'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_fouls'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_draw_fouls'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_interception'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_tackle'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_saved'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_blocked'] : '-') : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_clearance'] : '-') : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TeamPlayerStatDialog open={statOpen} onClose={() => setStatOpen(false)} player={currentPlayer} teamId={teamId} seasonId={seasonId} leagueId={leagueId} initialState={playerStat} />
        </Box>
    );
};

export default TeamPlayersStats;
