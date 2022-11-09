import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Divider, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useSelector } from 'react-redux';

import EditIcon from '@mui/icons-material/EditOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

import GameService from '../../../services/game.service';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import { getComparator, stableSort } from '../components/utilities';
import { ActionData } from '../components/common';
import { getPeriod } from '../games/tabs/overview/tagListItem';
import PlayerEditDialog from '../players/playerEditDialog';
import TeamPlayerStatDialog from '../teams/tabs/players/status';
import TeamStatsVideoPlayer from '../teams/tabs/stats/videoDialog';
import GameExportToEdits from '../games/tabs/overview/exportEdits';
import PlayersGamesDialog from '../players/gamesDialog';

import '../coach_style.css';

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

const Goalkeepers = () => {
    const [goalkeeperList, setGoalkeeperList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerStat, setPlayerStat] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editPlayer, setEditPlayer] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [statOpen, setStatOpen] = useState(false);
    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
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

    const getSortedArray = () => {
        return stableSort(goalkeeperList, getComparator(order, orderBy));
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

    const handleDisplayStats = () => {
        setMenuAnchorEl(null);
        GameService.getAllGamesByCoach(playerStat.season_id, null, playerStat.team_id, null).then((res) => {
            setGameList(res);
            setStatOpen(true);
        });
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
                ActionData[cell.action].action_result_id
            ).then((res) => {
                setPlayData(
                    res.map((item) => {
                        return {
                            start_time: item.player_tag_start_time,
                            end_time: item.player_tag_end_time,
                            player_name: item.player_names,
                            action_name: item.action_names,
                            action_type: item.action_type_names,
                            action_result: item.action_result_names,
                            game_id: item.game_id,
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
                ActionData[cell.action].action_result_id
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
            }).then((res) => {
                setGoalkeeperList(res.filter((item) => item.player_position === 'Goalkeeper'));
                setLoading(false);
            });
        } else setLoading(false);
    }, []);

    console.log('Goals => ', goalkeeperList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <p className="page-title">Goalkeepers</p>
            </Box>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && goalkeeperList.length > 0 && (
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
                                                {player[cell.id] ?? '-'}
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
                    {videoOpen && <TeamStatsVideoPlayer onClose={() => setVideoOpen(false)} video_url={gameList} tagList={playData} />}
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
        </Box>
    );
};

export default Goalkeepers;
