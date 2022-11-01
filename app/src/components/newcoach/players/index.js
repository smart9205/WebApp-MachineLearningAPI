import { Box, TextField, InputAdornment, IconButton, CircularProgress, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import SortIcon from '@mui/icons-material/SortOutlined';

import GameService from '../../../services/game.service';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import PlayerEditDialog from './playerEditDialog';
import TeamPlayerStatDialog from '../teams/tabs/players/status';
import '../coach_style.css';

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

const Players = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        searchText: '',
        teamList: [],
        teamFilter: 'none',
        loading: false
    });
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [playerStats, setPlayerStats] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [editPlayer, setEditPlayer] = useState(null);
    const [statOpen, setStatOpen] = useState(false);
    const [playerStat, setPlayerStat] = useState(null);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'desc';

        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(prop);
    };

    const handleDisplayList = (player) => {
        setCurrentPlayer({
            id: player.player_id,
            f_name: player.player_name.split(' ')[0],
            l_name: player.player_name.split(' ')[1],
            pos_name: player.player_position,
            date_of_birth: player.date_of_birth ?? '1970-01-01',
            image: player.image_url,
            jersey_number: player.player_jersey_number
        });
        setPlayerStat(player);
        setStatOpen(true);
    };

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

        return [];
    };

    const getSortedArray = () => {
        return stableSort(getPlayers(), getComparator(order, orderBy));
    };

    const getPlayers = () => {
        return searchText
            ? playerStats.filter((item) => compareStrings(item.player_position, searchText) || compareStrings(item.player_name, searchText) || compareStrings(item.team_name, searchText))
            : teamFilter !== 'none'
            ? playerStats.filter((item) => item.team_name === teamFilter)
            : playerStats;
    };

    const getTeamIds = (array) => {
        if (array.length > 0) {
            let result = [];

            array.map((item) => {
                const filter = result.filter((team) => team === item.team_id);

                if (filter.length === 0) result = [...result, item.team_id];

                return result;
            });

            return result;
        }

        return [];
    };

    const getLeagueIds = (array) => {
        if (array.length > 0) {
            let result = [];

            array.map((item) => {
                const filter = result.filter((league) => league === item.league_id);

                if (filter.length === 0) result = [...result, item.league_id];

                return result;
            });

            return result;
        }

        return [];
    };

    useEffect(async () => {
        let leagueIds = [];
        let teamIds = [];

        setState({ loading: true });
        await GameService.getAllLeaguesByCoach().then((res) => {
            leagueIds = getLeagueIds(res);
        });
        await GameService.getAllTeamsByCoach().then((res) => {
            teamIds = getTeamIds(res);
        });

        if (teamIds.length > 0) {
            await GameService.getPlayersStatsAdvanced({
                seasonId: null,
                leagueId: leagueIds.length > 0 ? leagueIds.join(',') : null,
                gameId: null,
                teamId: teamIds.join(','),
                playerId: null,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null
            }).then((data) => {
                setPlayerStats(data);
                setState({ loading: false, teamList: getTeamList(data) });
            });
        } else setState({ loading: false });
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
                    <Box sx={{ width: '100%', padding: '24px 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p className="page-title">Players</p>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p className="select-narrator">Team</p>
                                <Select
                                    value={teamFilter}
                                    onChange={handleChange('teamFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '300px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                                    fontSize: '0.8rem',
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
                    {playerStats.length > 0 && (
                        <Box sx={{ overflowY: 'auto', maxHeight: '85vh', marginLeft: '10px' }}>
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
                                            {headCells.map((cell) => (
                                                <TableCell key={cell.id} align="center" sortDirection={orderBy === cell.id ? order : false}>
                                                    <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => handleRequestSort(cell.id)}>
                                                        {cell.title}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                            <TableCell key="menu" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getSortedArray().map((player) => (
                                            <TableRow key={player.player_id} height="70px" hover>
                                                <TableCell width="5%" align="center" sx={{ cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                                    <img
                                                        style={{ height: '70px' , borderRadius: '8px' , paddingTop: '2px', paddingBottom:'2px'}}
                                                        
                                                        src={player ? (player.image_url.length > 0 ? player.image_url : PLAYER_ICON_DEFAULT) : PLAYER_ICON_DEFAULT}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={() => handleDisplayList(player)}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <p className="normal-text">#{player?.player_jersey_number ?? 0}</p>
                                                            <p className="normal-text">{player?.player_name ?? '-'}</p>
                                                        </div>
                                                        <p className="normal-text">{player?.player_position ?? '-'}</p>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{player?.team_name ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_player_games'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_goal'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_shot'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_dribble'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_crosses'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_corner'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_free_kick'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_passes'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_turnover'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_fouls'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_draw_fouls'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_interception'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_tackle'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_saved'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_blocked'] ?? '-'}</TableCell>
                                                <TableCell align="center">{player['total_clearance'] ?? '-'}</TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setEditPlayer(player);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <SortIcon />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <PlayerEditDialog open={editOpen} onClose={() => setEditOpen(false)} player={editPlayer} />
                            <TeamPlayerStatDialog open={statOpen} onClose={() => setStatOpen(false)} player={currentPlayer} teamId={null} seasonId={null} leagueId={null} initialState={playerStat} />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Players;
