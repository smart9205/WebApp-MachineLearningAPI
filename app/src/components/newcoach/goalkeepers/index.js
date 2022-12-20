import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Divider, MenuItem, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useSelector } from 'react-redux';

import EditIcon from '@mui/icons-material/EditOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import { getComparator, stableSort } from '../components/utilities';
import { ActionData, MenuProps } from '../components/common';
import { getPeriod } from '../games/tabs/overview/tagListItem';
import PlayerEditDialog from '../players/playerEditDialog';
import TeamStatsVideoPlayer from '../teams/tabs/stats/videoDialog';
import GameExportToEdits from '../games/tabs/overview/exportEdits';
import GoalkeepersGamesDialog from './gamesDialog';
import GoalkeeperStatDialog from './status';

const headCells = [
    { id: 'total_player_games', title: 'Games Played', action: '' },
    { id: 'total_build_ups', title: 'Build Ups', action: 'BuildUp' },
    { id: 'total_short_passes', title: 'Short Passes', action: 'ShortPass' },
    { id: 'total_long_passes', title: 'Long Passes', action: 'LongPass' },
    { id: 'total_super_save', title: 'Super Saved', action: 'SuperSaved' },
    { id: 'total_saved', title: 'Saved', action: 'Saved' },
    { id: 'total_goalkeeper_exit', title: 'Exits', action: 'Exits' },
    { id: 'total_air_challenge', title: 'Air Challenges', action: 'AirChallenge' },
    { id: 'total_ground_challenge', title: 'Ground Challenges', action: 'GroundChallenge' },
    { id: 'total_one_vs_one', title: '1 vs 1', action: 'One' },
    { id: 'total_goal_received', title: 'Goals Received', action: 'GoalReceive' },
    { id: 'total_opponent_crosses', title: 'Opponents Crosses', action: 'Cross' },
    { id: 'total_opponent_corners', title: 'Opponents Corners', action: 'Corner' },
    { id: 'total_opponent_free_kicks', title: 'Opponents Free Kicks', action: 'FreeKick' }
];

const Goalkeepers = ({ t }) => {
    const [goalkeeperList, setGoalkeeperList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('total_player_games');
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerStat, setPlayerStat] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editPlayer, setEditPlayer] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [gameIdsForStats, setGameIdsForStats] = useState([]);
    const [statOpen, setStatOpen] = useState(false);
    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [playerGames, setPlayerGames] = useState([]);
    const [gamesOpen, setGamesOpen] = useState(false);
    const [values, setValues] = useState({
        teamList: [],
        seasonList: [],
        teamFilter: 'none',
        seasonFilter: 'none'
    });

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'desc';

        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(prop);
    };

    const getFilteredList = () => {
        let list = [];

        if (values.seasonFilter !== 'none' && values.teamFilter === 'none') list = goalkeeperList.filter((item) => item.season_name === values.seasonFilter.name);
        else if (values.seasonFilter === 'none' && values.teamFilter !== 'none') list = goalkeeperList.filter((item) => item.team_name === values.teamFilter.name);
        else list = goalkeeperList.filter((item) => item.season_name === values.seasonFilter.name && item.team_name === values.teamFilter.name);

        return values.seasonFilter === 'none' && values.teamFilter === 'none' ? goalkeeperList : list;
    };

    const getSortedArray = () => {
        return stableSort(getFilteredList(), getComparator(order, orderBy));
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

    const handleDisplayStats = async () => {
        setMenuAnchorEl(null);
        await GameService.getAllGamesByCoach(playerStat.season_id, null, playerStat.team_id, null).then((res) => {
            setGameList(res);
        });
        await GameService.getPlayersGames(values.seasonFilter === 'none' ? null : values.seasonFilter.id, values.teamFilter === 'none' ? null : values.teamFilter.id, playerStat.player_id).then(
            (res) => {
                setGameIdsForStats(res.map((item) => item.game_id));
                setStatOpen(true);
            }
        );
    };

    const handleDisplayVideo = (cell, player) => async (e) => {
        if (cell.action !== '' && player[cell.id] !== undefined && player[cell.id] > 0) {
            let playerGameIds = [];
            let seasonId = values.seasonFilter === 'none' ? null : values.seasonFilter.id;

            await GameService.getAllGamesByCoach(player.season_id, null, player.team_id, null).then((res) => {
                setGameList(res.filter((item) => item.video_url.toLowerCase() !== 'no video'));
            });
            await GameService.getPlayersGames(seasonId, values.teamFilter === 'none' ? null : values.teamFilter.id, player.player_id).then((res) => {
                playerGameIds = res.map((item) => item.game_id);
            });

            if (cell.title.includes('Opponents')) {
                await GameService.getOpponentTags(
                    currentUser.id,
                    player.team_id,
                    null,
                    playerGameIds.length === 0 ? null : playerGameIds.join(','),
                    ActionData[cell.action].action_id,
                    ActionData[cell.action].action_type_id,
                    ActionData[cell.action].action_result_id,
                    null,
                    null,
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

                    if (res.length > 0) setVideoOpen(true);
                });
            } else {
                await GameService.getGamePlayerTags(
                    currentUser.id,
                    player.team_id,
                    `${player.player_id}`,
                    playerGameIds.length === 0 ? null : playerGameIds.join(','),
                    ActionData[cell.action].action_id,
                    ActionData[cell.action].action_type_id,
                    ActionData[cell.action].action_result_id,
                    null,
                    null,
                    null,
                    null,
                    null
                ).then((res) => {
                    const flist = cell.title === 'Exits' ? res.filter((item) => item.inside_the_pain === false) : res;

                    setPlayData(
                        flist.map((item) => {
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

                    if (flist.length > 0) setVideoOpen(true);
                });
            }
        }
    };

    const handleExportPlayerTags = (cell, player) => async (e) => {
        e.preventDefault();

        if (cell.action !== '' && player[cell.id] !== undefined && player[cell.id] > 0) {
            let playerGameIds = [];
            let seasonId = values.seasonFilter === 'none' ? null : values.seasonFilter.id;

            await GameService.getPlayersGames(seasonId, values.teamFilter === 'none' ? null : values.teamFilter.id, player.player_id).then((res) => {
                playerGameIds = res.map((item) => item.game_id);
            });

            if (cell.title.includes('Opponents')) {
                await GameService.getOpponentTags(
                    currentUser.id,
                    player.team_id,
                    null,
                    playerGameIds.length === 0 ? null : playerGameIds.join(','),
                    ActionData[cell.action].action_id,
                    ActionData[cell.action].action_type_id,
                    ActionData[cell.action].action_result_id,
                    null,
                    null,
                    null,
                    null,
                    null
                ).then((res) => {
                    setPlayData(res);

                    if (res.length > 0) setExportOpen(true);
                });
            } else {
                await GameService.getGamePlayerTags(
                    currentUser.id,
                    player.team_id,
                    `${player.player_id}`,
                    playerGameIds.length === 0 ? null : playerGameIds.join(','),
                    ActionData[cell.action].action_id,
                    ActionData[cell.action].action_type_id,
                    ActionData[cell.action].action_result_id,
                    null,
                    null,
                    null,
                    null,
                    null
                ).then((res) => {
                    const flist = cell.title === 'Exits' ? res.filter((item) => item.inside_the_pain === false) : res;

                    setPlayData(flist);

                    if (flist.length > 0) setExportOpen(true);
                });
            }
        }
    };

    const handleDisplayGames = async () => {
        let gameIds = [];

        setMenuAnchorEl(null);
        await GameService.getPlayersGames(values.seasonFilter === 'none' ? null : values.seasonFilter.id, values.teamFilter === 'none' ? null : values.teamFilter.id, playerStat.player_id).then(
            (res) => {
                gameIds = res.map((item) => item.game_id);
            }
        );
        await GameService.getGoalkeepersStatsGamebyGame({
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

    const getDisplayName = (player) => {
        if (player) {
            if (player.player_jersey_number === 999) return player.player_position;

            return `#${player.player_jersey_number} ${player.player_position}`;
        }

        return '-';
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

    const getTeamList = (array) => {
        if (array.length > 0) {
            let result = [];

            array.map((item) => {
                const filter = result.filter((team) => team.name === item.team_name);

                if (filter.length === 0) result = [...result, { name: item.team_name, id: item.team_id }];

                return result;
            });

            return result;
        }

        return [];
    };

    const getSeasonList = (array) => {
        if (array.length > 0) {
            let result = [];

            array.map((item) => {
                const filter = result.filter((team) => team.name === item.season_name);

                if (filter.length === 0) result = [...result, { name: item.season_name, id: item.season_id }];

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
        await GameService.getAllLeaguesByCoach(currentUser.id).then((res) => {
            leagueIds = getLeagueIds(res);
        });
        await GameService.getAllTeamsByCoach(currentUser.id).then((res) => {
            teamIds = getTeamIds(res);
        });

        if (teamIds.length > 0) {
            await GameService.getGoalkeepersStatsAdvanceSummary({
                seasonId: values.seasonFilter === 'none' ? null : values.seasonFilter.id,
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
                const list = res.filter((item) => item.player_position === 'Goalkeeper');

                setGoalkeeperList(list);

                if (values.seasonList.length === 0 || values.teamList.length === 0) setValues({ ...values, teamList: getTeamList(list), seasonList: getSeasonList(list) });

                setLoading(false);
            });
        } else setLoading(false);
    }, [values.seasonFilter]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="page-title">{t('Goalkeepers')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className="normal-text">{t('Season')}</p>
                        <Select
                            value={values.seasonFilter}
                            onChange={(e) => setValues({ ...values, seasonFilter: e.target.value })}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            <MenuItem key="0" value="none">
                                {t('All')}
                            </MenuItem>
                            {values.seasonList.map((season, index) => (
                                <MenuItem key={index + 1} value={season}>
                                    {season.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className="normal-text">{t('Team')}</p>
                        <Select
                            value={values.teamFilter}
                            onChange={(e) => setValues({ ...values, teamFilter: e.target.value })}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '36px', width: '300px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            <MenuItem key="0" value="none">
                                {t('All')}
                            </MenuItem>
                            {values.teamList.map((team, index) => (
                                <MenuItem key={index + 1} value={team}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </div>
            </Box>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && goalkeeperList.length > 0 && (
                <Box sx={{ height: '85vh', marginLeft: '10px', background: 'white' }}>
                    <TableContainer sx={{ maxHeight: '85vh' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow height="36px">
                                    <TableCell key="name" align="center" colSpan={2}>
                                        {t('Name')}
                                    </TableCell>
                                    <TableCell key="team" align="center">
                                        {t('Team')}
                                    </TableCell>
                                    {headCells.map((cell) => (
                                        <TableCell key={cell.id} align="center" sortDirection={orderBy === cell.id ? order : false}>
                                            <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => handleRequestSort(cell.id)}>
                                                {t(cell.title)}
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
                                        <TableCell key={`${player.player_id}-${index}-1`} sx={{ width: '115px' }}>
                                            <Box sx={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={handleShowMenu(player)}>
                                                <p className="normal-text">{player?.player_name ?? '-'}</p>
                                                <p className="normal-text">{getDisplayName(player)}</p>
                                            </Box>
                                        </TableCell>
                                        <TableCell key={`${player.player_id}-${index}-2`} sx={{ width: '160px' }} align="center">
                                            <p className="normal-text"> {player?.team_name ?? '-'}</p>
                                        </TableCell>
                                        {headCells.map((cell, cId) => (
                                            <TableCell
                                                key={`${cell.id}-${index}-${cId}`}
                                                align="center"
                                                sx={{ cursor: 'pointer', width: '55px' }}
                                                onClick={handleDisplayVideo(cell, player)}
                                                onContextMenu={handleExportPlayerTags(cell, player)}
                                            >
                                                <p className="normal-text"> {player[cell.id] ?? '-'}</p>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PlayerEditDialog t={t} open={editOpen} onClose={() => setEditOpen(false)} player={editPlayer} />
                    <GoalkeeperStatDialog
                        t={t}
                        open={statOpen}
                        onClose={() => setStatOpen(false)}
                        player={currentPlayer}
                        teamId={playerStat?.team_id ?? null}
                        seasonId={playerStat?.season_id ?? null}
                        games={gameList}
                        gameIds={gameIdsForStats}
                        initialState={playerStat}
                    />
                    <TeamStatsVideoPlayer t={t} open={videoOpen} onClose={() => setVideoOpen(false)} video_url={gameList} tagList={playData} />
                    <GameExportToEdits t={t} open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
                    <GoalkeepersGamesDialog
                        t={t}
                        open={gamesOpen}
                        onClose={() => setGamesOpen(false)}
                        list={playerGames}
                        playerName={playerStat?.player_name ?? ''}
                        teamId={playerStat?.team_id ?? 0}
                    />
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
                            <p className="menu-item">{t('Accumulated Stats')}</p>
                        </Box>
                        <Divider sx={{ width: '100%' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }} onClick={() => handleDisplayGames()}>
                            <SportsSoccerIcon />
                            <p className="menu-item">{t('Game By Game')}</p>
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
                            <p className="menu-item">{t('Edit Player')}</p>
                        </Box>
                    </Popover>
                </Box>
            )}
        </Box>
    );
};

export default Goalkeepers;
