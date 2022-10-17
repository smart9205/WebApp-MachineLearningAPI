import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    TableBody
} from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import PlayerListItem from './playerListItem';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

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

const Players = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        searchText: '',
        playersList: [],
        teamList: [],
        teamFilter: 'none',
        loading: false
    });
    const [playerIds, setPlayerIds] = useState([]);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [playerStats, setPlayerStats] = useState([]);

    const getPlayerStatus = (id) => {
        if (playerStats.length > 0) return playerStats.filter((item) => item.player_id === id)[0];

        return null;
    };

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'desc';

        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(prop);
    };

    const getSortedArray = () => {
        if (playersList.length > 0 && playerStats.length > 0) {
            const sortedStats = stableSort(playerStats, getComparator(order, orderBy));
            const other = playersList.filter((item) => !playerIds.includes(item.id));
            const inside = playersList.filter((item) => playerIds.includes(item.id));
            let newList = [];

            console.log('#########', inside, other);

            if (sortedStats.length === inside.length) {
                sortedStats.map((item) => {
                    const newItem = playersList.filter((data) => data.id === item.player_id)[0];

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

    const handleDisplayList = (player) => {};

    const { searchText, playersList, teamList, teamFilter, loading } = state;

    const handleChange = (prop) => (e) => {
        setState({ [prop]: e.target.value });
    };

    const compareStrings = (first, last) => {
        return first.toLowerCase().includes(last.toLowerCase());
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const getTeamList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'team_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((team) => team === item.team_name);

                if (filter.length === 0) result = [...result, item.team_name];

                return result;
            });

            return result;
        }
    };

    const getPlayers = () => {
        return searchText
            ? playersList.filter((item) => compareStrings(item.team_name, searchText) || compareStrings(item.pos_name, searchText) || compareStrings(item.name, searchText))
            : teamFilter !== 'none'
            ? playersList.filter((item) => item.team_name === teamFilter)
            : playersList;
    };

    const getUniqueKey = (player) => {
        return `${player.id}-${player.coach_id}`;
    };

    useEffect(async () => {
        setState({ loading: true });
        await GameService.getPlayersStatsAdvanced({
            seasonId: null,
            leagueId: null,
            gameId: null,
            teamId: null,
            playerId: null,
            gameTime: null,
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null,
            our: true
        }).then((data) => {
            setPlayerStats(data);
            setPlayerIds(data.map((item) => item.player_id));
        });
        await GameService.getMyCoachPlayerList().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'name'));

            setState({ playersList: ascArray, loading: false, teamList: getTeamList(res) });
        });
    }, []);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Players</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Team</Typography>
                                <Select
                                    value={teamFilter}
                                    onChange={handleChange('teamFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {teamList.map((team, index) => (
                                        <MenuItem key={index + 1} value={team}>
                                            {team}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <TextField
                                value={searchText}
                                onChange={handleChange('searchText')}
                                placeholder="Search"
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                sx={{
                                    width: '300px',
                                    '& legend': { display: 'none' },
                                    '& fieldset': { top: 0 },
                                    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                                    '& .MuiOutlinedInput-input': { padding: 0, height: '36px' }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                onMouseDown={handleMouseDownPassword}
                                                sx={{ backgroundColor: '#F8F8F8', '&:hover': { backgroundColor: '#F8F8F8' }, '&:focus': { backgroundColor: '#F8F8F8' } }}
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ overflowY: 'auto', maxHeight: '85vh', marginLeft: '24px' }}>
                        <TableContainer sx={{ maxHeight: '80vh' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell key="none" />
                                        <TableCell key="name" align="center">
                                            Name
                                        </TableCell>
                                        <TableCell key="team" align="center">
                                            Team
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
                                    {getSortedArray().map((player) => (
                                        <TableRow key={getUniqueKey(player)} height="70px" hover>
                                            <TableCell width="5%" align="center" sx={{ cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                                <img style={{ height: '48px' }} alt="Player Logo" src={player ? (player.image.length > 0 ? player.image : PLAYER_ICON_DEFAULT) : PLAYER_ICON_DEFAULT} />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ paddingLeft: '16px', cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player?.name ?? '-'}</Typography>
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#a5a5a8' }}>
                                                        #{player?.jersey_number ?? 0}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">{player?.team_name ?? '-'}</TableCell>
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
                                                {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_free_kick'] : '-') : '-'}
                                            </TableCell>
                                            <TableCell align="center">
                                                {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_passes'] : '-') : '-'}
                                            </TableCell>
                                            <TableCell align="center">
                                                {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_turnover'] : '-') : '-'}
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
                                                {playerIds.includes(player?.id ?? 0) ? (getPlayerStatus(player?.id ?? 0) ? getPlayerStatus(player?.id ?? 0)['total_clearance'] : '-') : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Players;
