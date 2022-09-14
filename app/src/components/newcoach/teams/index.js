import React, { useReducer, useEffect } from 'react';
import { Typography, Box, Select, CircularProgress, MenuItem } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import TeamListItem from './teamListItem';
import { MenuProps } from '../components/common';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
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

const Teams = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        hoverIndex: -1,
        teamsList: [],
        seasonList: [],
        seasonFilter: 'none',
        leagueList: [],
        leagueFilter: 'none',
        loading: false
    });

    const { hoverIndex, teamsList, seasonList, seasonFilter, leagueList, leagueFilter, loading } = state;

    const handleChange = (prop) => (e) => {
        setState({ [prop]: e.target.value });
    };

    const handleMouseEnter = (idx) => {
        setState({ hoverIndex: idx });
    };

    const handleMouseLeave = () => {
        setState({ hoverIndex: -1 });
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

    const getLeagueList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'league_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((season) => season === item.league_name);

                if (filter.length === 0) result = [...result, item.league_name];

                return result;
            });

            return result;
        }
    };

    const getTeamsList = () => {
        let array = [];

        if (seasonFilter !== 'none' && leagueFilter === 'none') array = teamsList.filter((game) => game.season_name === seasonFilter);
        else if (leagueFilter !== 'none' && seasonFilter === 'none') array = teamsList.filter((game) => game.league_name === leagueFilter);
        else array = teamsList.filter((game) => game.league_name === leagueFilter && game.season_name === seasonFilter);

        return seasonFilter === 'none' && leagueFilter === 'none' ? teamsList : array;
    };

    useEffect(() => {
        setState({ loading: true });
        GameService.getAllMyCoachTeam().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'team_name'));

            setState({ teamsList: ascArray, seasonList: getSeasonList(res), leagueList: getLeagueList(res), loading: false });
        });
    }, []);

    console.log('Teams => ', teamsList);

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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Teams</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Season</Typography>
                                <Select
                                    value={seasonFilter}
                                    onChange={handleChange('seasonFilter')}
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
                                    {seasonList.map((season, index) => (
                                        <MenuItem key={index + 1} value={season}>
                                            {season}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>League</Typography>
                                <Select
                                    value={leagueFilter}
                                    onChange={handleChange('leagueFilter')}
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
                                    {leagueList.map((league, index) => (
                                        <MenuItem key={index + 1} value={league}>
                                            {league}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ overflowY: 'auto', maxHeight: '85vh', marginLeft: '24px' }}>
                        <Box sx={{ marginRight: '4px' }}>
                            {getTeamsList().map((team, index) => (
                                <Box key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                    <TeamListItem row={team} isHover={hoverIndex === index} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Teams;
