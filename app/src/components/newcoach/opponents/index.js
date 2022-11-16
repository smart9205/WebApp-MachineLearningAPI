import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Select, MenuItem } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import GameListItem from './gameListItem';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';
import '../coach_style.css';

const Opponents = () => {
    const [values, setValues] = useState({
        loading: false,
        gameList: [],
        hoverIndex: -1,
        periodFilter: '0',
        teamFilter: 'none',
        seasonFilter: 'none',
        leagueFilter: 'none',
        teamList: [],
        seasonList: [],
        leagueList: []
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const getDescGamesList = (array) => {
        return array.length > 0 ? stableSort(array, getComparator('desc', 'date')) : [];
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

    const getTeamList = (array) => {
        if (array.length > 0) {
            let result = [];

            array.map((item) => {
                const filter = result.filter((team) => team === item.home_team_name);
                const filter1 = result.filter((team) => team === item.away_team_name);

                if (filter.length === 0) result = [...result, item.home_team_name];

                if (filter1.length === 0) result = [...result, item.away_team_name];

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
                const filter = result.filter((league) => league === item.league_name);

                if (filter.length === 0) result = [...result, item.league_name];

                return result;
            });

            return result;
        }

        return [];
    };

    const getFilteredGamesList = (newList) => {
        let array = [];

        if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none') array = newList.filter((game) => game.season_name === values.seasonFilter);
        else if (values.leagueFilter !== 'none' && values.seasonFilter === 'none' && values.teamFilter === 'none') array = newList.filter((game) => game.league_name === values.leagueFilter);
        else if (values.teamFilter !== 'none' && values.seasonFilter === 'none' && values.leagueFilter === 'none')
            array = newList.filter((game) => game.home_team_name === values.teamFilter || game.away_team_name === values.teamFilter);
        else if (values.seasonFilter !== 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none')
            array = newList.filter((game) => game.season_name === values.seasonFilter && game.league_name === values.leagueFilter);
        else if (values.seasonFilter !== 'none' && values.teamFilter !== 'none' && values.leagueFilter === 'none')
            array = newList.filter((game) => game.season_name === values.seasonFilter && (game.home_team_name === values.teamFilter || game.away_team_name === values.teamFilter));
        else if (values.leagueFilter.length > 0 && values.teamFilter !== 'none' && values.seasonFilter === 'none')
            array = newList.filter((game) => game.league_name === values.leagueFilter && (game.home_team_name === values.teamFilter || game.away_team_name === values.teamFilter));
        else
            array = newList.filter(
                (game) =>
                    game.league_name === values.leagueFilter && game.season_name === values.seasonFilter && (game.home_team_name === values.teamFilter || game.away_team_name === values.teamFilter)
            );

        return values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' ? newList : array;
    };

    const getBelongedGameList = (oldList) => {
        const today = new Date();
        let newList = [];

        if (values.periodFilter === '1') newList = oldList.filter((game) => new Date(game.date) >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) && new Date(game.date) <= today);
        else if (values.periodFilter === '2') newList = oldList.filter((game) => new Date(game.date) >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) && new Date(game.date) <= today);

        return values.periodFilter === '0' ? oldList : newList;
    };

    const getGamesList = () => {
        return getFilteredGamesList(getBelongedGameList(values.gameList));
    };

    useEffect(() => {
        setValues({ ...values, loading: true, gameList: [] });
        GameService.getAdditionalGames(null, null, null, null).then((res) => {
            setValues({ ...values, loading: false, gameList: getDescGamesList(res), seasonList: getSeasonList(res), teamList: getTeamList(res), leagueList: getLeagueList(res) });
        });
    }, []);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!values.loading && (
                <>
                    <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <p className="page-title">Opponents</p>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p className="select-narrator">Period</p>
                                <Select
                                    value={values.periodFilter}
                                    onChange={handleChange('periodFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem value="0">All</MenuItem>
                                    <MenuItem value="1">Last week</MenuItem>
                                    <MenuItem value="2">Last month</MenuItem>
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p className="select-narrator">Season</p>
                                <Select
                                    value={values.seasonFilter}
                                    onChange={handleChange('seasonFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {values.seasonList.map((season, index) => (
                                        <MenuItem key={index + 1} value={season}>
                                            {season}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p className="select-narrator">League</p>
                                <Select
                                    value={values.leagueFilter}
                                    onChange={handleChange('leagueFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {values.leagueList.map((league, index) => (
                                        <MenuItem key={index + 1} value={league}>
                                            {league}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p className="select-narrator">Team</p>
                                <Select
                                    value={values.teamFilter}
                                    onChange={handleChange('teamFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {values.teamList.map((team, index) => (
                                        <MenuItem key={index + 1} value={team}>
                                            {team}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ overflowY: 'auto', maxHeight: '80vh', marginLeft: '24px' }}>
                        <Box sx={{ marginRight: '4px' }}>
                            {getGamesList().map((game, index) => (
                                <Box key={index} onMouseEnter={() => setValues({ ...values, hoverIndex: index })} onMouseLeave={() => setValues({ ...values, hoverIndex: -1 })}>
                                    <GameListItem row={game} isHover={values.hoverIndex === index} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Opponents;
