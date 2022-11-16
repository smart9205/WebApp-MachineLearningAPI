import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import LeadersPlayerStatColumn from './playerStatColumn';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';
import LeadersPlayerStatDialog from './status';
import '../coach_style.css';

const statCategory = [
    { id: 'player_games', title: 'Games Played' },
    { id: 'goal', title: 'Goals' },
    { id: 'penalties', title: 'Penalties' },
    { id: 'penalties_missed', title: 'Missed Penalties' },
    { id: 'shot', title: 'Shots' },
    { id: 'shot_on_target', title: 'Shots On Target' },
    { id: 'shot_off_target', title: 'Shots Off Target' },
    { id: 'shot_on_box', title: 'Shots On Box' },
    { id: 'free_kick', title: 'Free Kicks' },
    { id: 'crosses', title: 'Crosses' },
    { id: 'dribble', title: 'Dribbles' },
    { id: 'dribble_successful', title: 'Successful Dribbles' },
    { id: 'passes', title: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes' },
    { id: 'passes_for_goals', title: 'Passes For Goals' },
    { id: 'passes_for_shots', title: 'Passes For Shots' },
    { id: 'own_goals', title: 'Own Goals' },
    { id: 'key_passes', title: 'Key Passes' },
    { id: 'through_passes', title: 'Through Passes' },
    { id: 'through_passes_successful', title: 'Through Passes Successful' },
    { id: 'offside', title: 'Offside' },
    { id: 'turnover', title: 'Turnovers' },
    { id: 'turnover_on_offensive_court', title: 'Turnovers on Offensive Court' },
    { id: 'turnover_on_defensive_court', title: 'Turnovers on Defensive Court' },
    { id: 'saved', title: 'Saved & Super Saved' },
    { id: 'tackle', title: 'Tackles' },
    { id: 'tackle_on_offensive_court', title: 'Tackles on Offensive Court' },
    { id: 'tackle_on_defensive_court', title: 'Tackles on Defensive Court' },
    { id: 'clearance', title: 'Clearance' },
    { id: 'interception', title: 'Interceptions' },
    { id: 'interception_on_offensive_court', title: 'Interceptions on Offensive Court' },
    { id: 'interception_on_defensive_court', title: 'Interceptions on Defensive Court' },
    { id: 'fouls', title: 'Fouls' },
    { id: 'draw_fouls', title: 'Draw Fouls' },
    { id: 'red_cards', title: 'Red Cards' },
    { id: 'yellow_cards', title: 'Yellow Cards' }
];

const Leaders = () => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teamList, setTeamList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [leagueList, setLeagueList] = useState([]);
    const [playersList, setPlayersList] = useState([]);
    const [displayOption, setDisplayOption] = useState('total');
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [statOpen, setStatOpen] = useState(false);
    const [values, setValues] = useState({
        teamFilter: 'none',
        seasonFilter: 'none',
        leagueFilter: 'none',
        playerFilter: null
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const handleDisplayStatDialog = (player) => {
        setCurrentPlayer(player);
        setStatOpen(true);
    };

    const getSeasonList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'season_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((season) => season === item.season_name);

                if (filter.length === 0) result = [...result, item.season_name];

                return result;
            });

            return result;
        }

        return [];
    };

    const getPlayersList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'player_name'));
            let result = [];

            desc.map((item, index) => {
                const filter = result.filter((season) => season.name === item.player_name);

                if (filter.length === 0) result = [...result, { id: index + 1, name: item.player_name }];

                return result;
            });

            return result;
        }

        return [];
    };

    const getTeamList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'team_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((team) => team.name === item.team_name && team.id === item.team_id);

                if (filter.length === 0) result = [...result, { name: item.team_name, id: item.team_id }];

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

    const getLeagueList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'league_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((league) => league.name === item.league_name && league.id === item.league_id);

                if (filter.length === 0) result = [...result, { name: item.league_name, id: item.league_id }];

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

    const getFilteredList = () => {
        let array = [];

        if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.season_name === values.seasonFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.league_name === values.leagueFilter.name);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.team_name === values.teamFilter.name);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter !== null)
            array = playerList.filter((item) => item.player_name === values.playerFilter.name);
        else if (values.seasonFilter !== 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.league_name === values.leagueFilter.name);
        else if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.team_name === values.teamFilter.name);
        else if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter !== null)
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.player_name === values.playerFilter.name);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter !== 'none' && values.playerFilter === null)
            array = playerList.filter((item) => item.league_name === values.leagueFilter.name && item.team_name === values.teamFilter.name);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter !== null)
            array = playerList.filter((item) => item.league_name === values.leagueFilter.name && item.player_name === values.playerFilter.name);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter !== null)
            array = playerList.filter((item) => item.player_name === values.playerFilter.name && item.team_name === values.teamFilter.name);
        else
            array = playerList.filter(
                (item) =>
                    item.league_name === values.leagueFilter.name &&
                    item.season_name === values.seasonFilter &&
                    item.team_name === values.teamFilter.name &&
                    item.player_name === values.playerFilter.name
            );

        return values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter === null ? playerList : array;
    };

    useEffect(async () => {
        if (leagueList.length === 0 && teamList.length === 0 && playersList.length === 0) {
            let leagueIds = [];
            let teamIds = [];

            setLoading(true);
            await GameService.getAllLeaguesByCoach().then((res) => {
                setLeagueList(getLeagueList(res));
                leagueIds = getLeagueIds(res);
            });
            await GameService.getAllTeamsByCoach().then((res) => {
                setTeamList(getTeamList(res));
                teamIds = getTeamIds(res);
            });
            await GameService.getAllPlayersByCoach().then((res) => {
                setPlayersList(getPlayersList(res));
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
                    setPlayerList(res);
                    setSeasonList(getSeasonList(res));
                    setLoading(false);
                });
            }
        } else {
            const leagueIds = values.leagueFilter === 'none' ? leagueList.map((item) => item.id) : [];
            const teamIds = teamList.map((item) => item.id);

            if (teamIds.length > 0) {
                setLoading(true);
                await GameService.getPlayersStatsAdvanced({
                    seasonId: null,
                    leagueId: values.leagueFilter === 'none' ? (leagueIds.length > 0 ? leagueIds.join(',') : null) : `${values.leagueFilter.id}`,
                    gameId: null,
                    teamId: teamIds.join(','),
                    playerId: null,
                    gameTime: null,
                    courtAreaId: null,
                    insidePaint: null,
                    homeAway: null,
                    gameResult: null
                }).then((res) => {
                    setPlayerList(res);
                    setSeasonList(getSeasonList(res));
                    setLoading(false);
                });
            }
        }
    }, [values.leagueFilter]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p className="page-title">Leaders</p>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', paddingLeft: '30px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p className="select-narrator">Seasons</p>
                                    <Select
                                        value={values.seasonFilter}
                                        onChange={handleChange('seasonFilter')}
                                        label=""
                                        variant="outlined"
                                        IconComponent={ExpandMoreIcon}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        MenuProps={MenuProps}
                                        sx={{ outline: 'none', height: '36px', width: '120px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem key="0" value="none">
                                            All
                                        </MenuItem>
                                        {seasonList.map((season, index) => (
                                            <MenuItem key={index + 1} value={season}>
                                                {season}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p className="select-narrator">Leagues</p>
                                    <Select
                                        value={values.leagueFilter}
                                        onChange={handleChange('leagueFilter')}
                                        label=""
                                        variant="outlined"
                                        IconComponent={ExpandMoreIcon}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        MenuProps={MenuProps}
                                        sx={{ outline: 'none', height: '36px', width: '170px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem key="0" value="none">
                                            All
                                        </MenuItem>
                                        {leagueList.map((league, index) => (
                                            <MenuItem key={index + 1} value={league}>
                                                {league.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p className="select-narrator">Teams</p>
                                    <Select
                                        value={values.teamFilter}
                                        onChange={handleChange('teamFilter')}
                                        label=""
                                        variant="outlined"
                                        IconComponent={ExpandMoreIcon}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        MenuProps={MenuProps}
                                        sx={{ outline: 'none', height: '36px', width: '220px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem key="0" value="none">
                                            All
                                        </MenuItem>
                                        {teamList.map((team, index) => (
                                            <MenuItem key={index + 1} value={team}>
                                                {team.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p className="select-narrator">Display</p>
                                    <Select
                                        value={displayOption}
                                        onChange={(e) => setDisplayOption(e.target.value)}
                                        label=""
                                        variant="outlined"
                                        IconComponent={ExpandMoreIcon}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        MenuProps={MenuProps}
                                        sx={{ outline: 'none', height: '36px', width: '110px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem key="0" value="total">
                                            Total
                                        </MenuItem>
                                        <MenuItem key="1" value="average">
                                            Average
                                        </MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={playersList}
                                        value={values.playerFilter}
                                        isOptionEqualToValue={(option, value) => option && option.name}
                                        getOptionLabel={(option) => (!option.name ? '' : option.name)}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.name}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Player" sx={{ my: 1 }} />}
                                        onChange={(event, newValue) => setValues({ ...values, playerFilter: newValue })}
                                        sx={{
                                            width: '210px',
                                            fontSize: '0.8rem',
                                            '& .MuiOutlinedInput-root': { padding: '0 0 0 9px' },
                                            '& .MuiInputLabel-root': { top: '-8px' }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {playerList.length > 0 && (
                        <Box sx={{ width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
                            <Box sx={{ fontSize: '0.8rem', display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '4px' }}>
                                {statCategory.map((item) => (
                                    <LeadersPlayerStatColumn
                                        key={item.id}
                                        list={getFilteredList()}
                                        isTotal={item.id === 'player_games' ? true : displayOption === 'total'}
                                        option={item.id}
                                        title={item.title}
                                        onClick={handleDisplayStatDialog}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </>
            )}
            <LeadersPlayerStatDialog open={statOpen} onClose={() => setStatOpen(false)} player={currentPlayer} />
        </Box>
    );
};

export default Leaders;
