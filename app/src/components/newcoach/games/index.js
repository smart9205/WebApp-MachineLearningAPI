import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Typography, Select } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import GameService from '../../../services/game.service';
import { LoadingProgress } from '../components/common';
import GameListItem from './gameListItem';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function descendingComparatorNew(a, b) {
    if (b < a) return -1;

    if (b > a) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function getComparatorNew(order) {
    return order === 'desc' ? (a, b) => descendingComparatorNew(a, b) : (a, b) => -descendingComparatorNew(a, b);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

const Tabs = ['Processed', 'Pending'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200
        }
    }
};

const Games = () => {
    const [values, setValues] = useState({
        loading: false,
        hoverIndex: -1,
        curTab: 0,
        periodFilter: '0',
        teamFilter: 'none',
        seasonFilter: 'none',
        leagueFilter: 'none',
        gamesList: [],
        teamList: [],
        seasonList: [],
        leagueList: []
    });
    const [refreshPage, setRefreshPage] = useState(false);

    const handleTabClick = (index) => {
        setValues({ ...values, curTab: index });
    };

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const handleMouseEnter = (idx) => {
        setValues({ ...values, hoverIndex: idx });
    };

    const handleMouseLeave = () => {
        setValues({ ...values, hoverIndex: -1 });
    };

    const getDescGamesList = (array) => {
        return stableSort(array, getComparator('desc', 'date'));
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

        console.log('Games => ', values.seasonFilter, values.leagueFilter, values.teamFilter, array);
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
        const newList =
            values.curTab === 0 ? values.gamesList.filter((game) => game.video_url.toLowerCase() !== 'no video') : values.gamesList.filter((game) => game.video_url.toLowerCase() === 'no video');

        return getFilteredGamesList(getBelongedGameList(newList));
    };

    useEffect(() => {
        setValues({ ...values, loading: true });
        GameService.getAllGamesByCoach(null, null, null, null).then((res) => {
            setValues({ ...values, gamesList: getDescGamesList(res), seasonList: getSeasonList(res), teamList: getTeamList(res), leagueList: getLeagueList(res), loading: false });
        });
    }, [refreshPage]);

    console.log('Games => ', refreshPage, values.gamesList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 24px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Games</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    {Tabs.map((tab, index) => (
                        <Box onClick={() => handleTabClick(index)} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '8px', width: 'fit-content', cursor: 'pointer' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1a1b1d' }}>{tab}</Typography>
                            <Box sx={{ width: '100%', height: '2px', backgroundColor: values.curTab === index ? 'red' : '#F8F8F8' }} />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Period</Typography>
                        <Select
                            value={values.periodFilter}
                            onChange={handleChange('periodFilter')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '48px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        >
                            <MenuItem value="0">All</MenuItem>
                            <MenuItem value="1">Last week</MenuItem>
                            <MenuItem value="2">Last month</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Season</Typography>
                        <Select
                            value={values.seasonFilter}
                            onChange={handleChange('seasonFilter')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '48px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>League</Typography>
                        <Select
                            value={values.leagueFilter}
                            onChange={handleChange('leagueFilter')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '48px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Team</Typography>
                        <Select
                            value={values.teamFilter}
                            onChange={handleChange('teamFilter')}
                            label=""
                            variant="outlined"
                            IconComponent={ExpandMoreIcon}
                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={MenuProps}
                            sx={{ outline: 'none', height: '48px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
            <Box sx={{ overflowY: 'auto', maxHeight: '70vh', marginLeft: '24px' }}>
                <Box sx={{ marginRight: '4px' }}>
                    {getGamesList().map((game, index) => (
                        <Box key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                            <GameListItem row={game} isHover={values.hoverIndex === index} isPending={values.curTab === 1} updateList={setRefreshPage} team={values.teamFilter} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {values.loading && <LoadingProgress />}
        </Box>
    );
};

export default Games;
