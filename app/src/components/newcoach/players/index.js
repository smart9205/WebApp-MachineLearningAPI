import {
    Box,
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
    TableBody,
    Popover,
    Divider
} from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

import GameService from '../../../services/game.service';
import { ActionData, MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import PlayerEditDialog from './playerEditDialog';
import TeamPlayerStatDialog from '../teams/tabs/players/status';
import '../coach_style.css';
import { getPeriod } from '../games/tabs/overview/tagListItem';
import TeamStatsVideoPlayer from '../teams/tabs/stats/videoDialog';
import GameExportToEdits from '../games/tabs/overview/exportEdits';
import PlayersGamesDialog from './gamesDialog';

const headCells = [
    { id: 'total_player_games', title: 'Games' },
    { id: 'total_goal', title: 'Goals', action: 'Goal' },
    { id: 'total_shot', title: 'Shots', action: 'GoalKick' },
    { id: 'total_dribble', title: 'Dribbles', action: 'Dribble' },
    { id: 'total_crosses', title: 'Crosses', action: 'Cross' },
    { id: 'total_corner', title: 'Corners', action: 'Corner' },
    { id: 'total_free_kick', title: 'Free Kicks', action: 'FreeKick' },
    { id: 'total_passes', title: 'Passes', action: 'Passes' },
    { id: 'total_turnover', title: 'Turnovers', action: 'Turnover' },
    { id: 'total_fouls', title: 'Fouls', action: 'Foul' },
    { id: 'total_draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'total_interception', title: 'Interceptions', action: 'Interception' },
    { id: 'total_tackle', title: 'Tackles', action: 'Tackle' },
    { id: 'total_saved', title: 'Saved', action: 'Saved' },
    { id: 'total_blocked', title: 'Blocked', action: 'Blocked' },
    { id: 'total_clearance', title: 'Clearance', action: 'Clearance' }
];

const Players = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        searchText: '',
        teamList: [],
        teamFilter: 'none',
        seasonList: [],
        seasonFilter: 'none'
    });
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [playerStats, setPlayerStats] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [editPlayer, setEditPlayer] = useState(null);
    const [statOpen, setStatOpen] = useState(false);
    const [playerStat, setPlayerStat] = useState(null);
    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [gameList, setGameList] = useState([]);
    const [exportOpen, setExportOpen] = useState(false);
    const [playerGames, setPlayerGames] = useState([]);
    const [gamesOpen, setGamesOpen] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'desc';

        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(prop);
    };

    const handleShowMenu = (player) => (e) => {
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
        setMenuAnchorEl(e.currentTarget);
    };

    const handleDisplayVideo = (cell, player) => async (e) => {
        if (cell.title !== 'Games' && player[cell.id] !== undefined && player[cell.id] > 0) {
            let gameIds = [];

            await GameService.getAllGamesByCoach(player.season_id, null, player.team_id, null).then((res) => {
                const videoGames = res.filter((item) => item.video_url.toLowerCase() !== 'no video');

                setGameList(videoGames);
                gameIds = videoGames.map((item) => item.id);
            });
            await GameService.getGamePlayerTags(
                currentUser.id,
                player.team_id,
                `${player.player_id}`,
                gameIds.length === 0 ? null : gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id,
                null,
                null,
                null
            ).then((res) => {
                setPlayData(
                    res.map((item) => {
                        return {
                            tag_id: item.id,
                            start_time: item.player_tag_start_time,
                            end_time: item.player_tag_end_time,
                            player_name: item.player_names,
                            action_name: item.action_names,
                            action_type: item.action_type_names,
                            action_result: item.action_result_names,
                            game_id: item.game_id,
                            team_id: player.team_id,
                            court_area: item.court_area_id,
                            inside_pain: item.inside_the_pain,
                            period: getPeriod(item.period),
                            time: item.time_in_game,
                            home_team_image: item.home_team_logo,
                            away_team_image: item.away_team_logo,
                            home_team_goals: item.home_team_goal,
                            away_team_goals: item.away_team_goal
                        };
                    })
                );
                setVideoOpen(true);
            });
        }
    };

    const handleExportPlayerTags = (cell, player) => async (e) => {
        e.preventDefault();

        if (cell.title !== 'Games' && player[cell.id] !== undefined && player[cell.id] > 0) {
            let gameIds = [];

            await GameService.getAllGamesByCoach(player.season_id, null, player.team_id, null).then((res) => {
                const videoGames = res.filter((item) => item.video_url.toLowerCase() !== 'no video');

                setGameList(videoGames);
                gameIds = videoGames.map((item) => item.id);
            });
            await GameService.getGamePlayerTags(
                currentUser.id,
                player.team_id,
                `${player.player_id}`,
                gameIds.length === 0 ? null : gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id,
                null,
                null,
                null
            ).then((res) => {
                setPlayData(res);
                setExportOpen(true);
            });
        }
    };

    const handleDisplayGames = async () => {
        let gameIds = [];

        setMenuAnchorEl(null);
        await GameService.getAllGamesByCoach(playerStat.season_id, null, playerStat.team_id, null).then((res) => {
            gameIds = res.map((item) => item.id);
        });
        await GameService.getPlayersStatsGamebyGame({
            seasonId: playerStat.season_id,
            leagueId: null,
            gameId: gameIds.length === 0 ? null : gameIds.join(','),
            teamId: playerStat.team_id,
            playerId: playerStat.player_id,
            gameTime: null,
            courtAreaId: null,
            insidePaint: null,
            homeAway: null,
            gameResult: null
        }).then((res) => {
            setPlayerGames(stableSort(res, getComparator('desc', 'game_date')));
            setGamesOpen(true);
        });
    };

    const handleDisplayStats = () => {
        setMenuAnchorEl(null);
        GameService.getAllGamesByCoach(playerStat.season_id, null, playerStat.team_id, null).then((res) => {
            setGameList(res);
            setStatOpen(true);
        });
    };

    const { searchText, teamList, teamFilter, seasonList, seasonFilter } = state;

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

    const getSeasonList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'season_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((season) => season.name === item.season_name);

                if (filter.length === 0) result = [...result, { id: item.season_id, name: item.season_name }];

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
            ? playerStats.filter(
                  (item) =>
                      compareStrings(item.player_position, searchText) ||
                      compareStrings(item.player_name, searchText) ||
                      compareStrings(item.team_name, searchText) ||
                      compareStrings(item.season_name, searchText)
              )
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

        setLoading(true);
        await GameService.getAllLeaguesByCoach().then((res) => {
            leagueIds = getLeagueIds(res);
        });
        await GameService.getAllTeamsByCoach().then((res) => {
            teamIds = getTeamIds(res);
        });

        if (teamIds.length > 0) {
            await GameService.getPlayersStatsAdvanceSummary({
                seasonId: seasonFilter === 'none' ? null : seasonFilter.id,
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

                if (seasonList.length === 0 || teamList.length === 0) setState({ teamList: getTeamList(data), seasonList: getSeasonList(data) });

                setLoading(false);
            });
        } else setLoading(false);
    }, [seasonFilter]);

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
                                <p className="select-narrator">Season</p>
                                <Select
                                    value={seasonFilter}
                                    onChange={handleChange('seasonFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {seasonList.map((season, index) => (
                                        <MenuItem key={index + 1} value={season}>
                                            {season.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
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
                        <Box sx={{ height: '80vh', marginLeft: '10px', background: 'white' }}>
                            <TableContainer sx={{ maxHeight: '80vh' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow height="36px">
                                            <TableCell key="name" align="center" colSpan={2}>
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getSortedArray().map((player, index) => (
                                            <TableRow key={`${player.player_id}-${index}`} height="70px" hover>
                                                <TableCell key={`${player.player_id}-${index}-0`} width="5%" align="center" sx={{ cursor: 'pointer' }} onClick={handleShowMenu(player)}>
                                                    <img
                                                        style={{ height: '70px', borderRadius: '8px', paddingTop: '2px', paddingBottom: '2px' }}
                                                        src={player ? (player.image_url.length > 0 ? player.image_url : PLAYER_ICON_DEFAULT) : PLAYER_ICON_DEFAULT}
                                                    />
                                                </TableCell>
                                                <TableCell key={`${player.player_id}-${index}-1`}>
                                                    <Box sx={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={handleShowMenu(player)}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <p className="normal-text">#{player?.player_jersey_number ?? 0}</p>
                                                            <p className="normal-text">{player?.player_name ?? '-'}</p>
                                                        </div>
                                                        <p className="normal-text">{player?.player_position ?? '-'}</p>
                                                    </Box>
                                                </TableCell>
                                                <TableCell key={`${player.player_id}-${index}-2`} align="center">
                                                    {player?.team_name ?? '-'}
                                                </TableCell>
                                                {headCells.map((cell, cId) => (
                                                    <TableCell
                                                        key={`${cell.id}-${index}-${cId}`}
                                                        align="center"
                                                        sx={{ cursor: 'pointer' }}
                                                        onClick={handleDisplayVideo(cell, player)}
                                                        onContextMenu={handleExportPlayerTags(cell, player)}
                                                    >
                                                        {cell.id === 'total_saved' ? player[cell.id] + player['total_super_save'] : player[cell.id]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <PlayerEditDialog open={editOpen} onClose={() => setEditOpen(false)} player={editPlayer} />
                            <TeamPlayerStatDialog
                                open={statOpen}
                                onClose={() => setStatOpen(false)}
                                player={currentPlayer}
                                teamId={playerStat?.team_id ?? null}
                                seasonId={playerStat?.season_id ?? null}
                                games={gameList}
                                gameIds={gameList.map((item) => item.id)}
                                initialState={playerStat}
                            />
                            <TeamStatsVideoPlayer open={videoOpen} onClose={() => setVideoOpen(false)} video_url={gameList} tagList={playData} />
                            <GameExportToEdits open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
                            <PlayersGamesDialog open={gamesOpen} onClose={() => setGamesOpen(false)} list={playerGames} playerName={playerStat?.player_name ?? ''} />
                            <Popover
                                id={menuPopoverId}
                                open={menuPopoverOpen}
                                anchorEl={menuAnchorEl}
                                onClose={() => setMenuAnchorEl(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                sx={{ '& .MuiPopover-paper': { width: '220px', borderRadius: '12px', border: '1px solid #E8E8E8' } }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleDisplayStats()}>
                                    <QueryStatsIcon />
                                    <p className="menu-item">Accumulated Stats</p>
                                </Box>
                                <Divider sx={{ width: '100%' }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleDisplayGames()}>
                                    <SportsSoccerIcon />
                                    <p className="menu-item">Game By Game</p>
                                </Box>
                                <Divider sx={{ width: '100%' }} />
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }}
                                    onClick={() => {
                                        setMenuAnchorEl(null);
                                        setEditPlayer(playerStat);
                                        setEditOpen(true);
                                    }}
                                >
                                    <EditIcon />
                                    <p className="menu-item">Edit Player</p>
                                </Box>
                            </Popover>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Players;
