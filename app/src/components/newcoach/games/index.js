import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Typography, Select, CircularProgress } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import GameListItem from './gameListItem';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';

const Tabs = ['Processed', 'Pending'];

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
    const [standingList, setStandingList] = useState([]);

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
        return array.length > 0 ? stableSort(array, getComparator('desc', 'date')) : [];
    };

    const updateGameList = (item, isEdit) => {
        let list = [...values.gamesList];

        for (let i = 0; i < list.length; i += 1) {
            if (list[i].id === item.id) {
                if (isEdit) {
                    list[i].image = item.image;
                    list[i].mute_video = item.mute_video;
                    list[i].home_team_standing_id = item.home_team_standing_id;
                    list[i].home_team_standing_image = item.home_team_standing_image;
                    list[i].home_team_standing_name = item.home_team_standing_name;
                    list[i].away_team_standing_id = item.away_team_standing_id;
                    list[i].away_team_standing_image = item.away_team_standing_image;
                    list[i].away_team_standing_name = item.away_team_standing_name;
                } else {
                    list[i].video_url = item.video_url;
                    list[i].mobile_video_url = item.mobile_video_url;
                }

                console.log('++++++++++ ', item, list[i]);
                setValues({ ...values, gamesList: list });

                return;
            }
        }
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
        const newList =
            values.curTab === 0 ? values.gamesList.filter((game) => game.video_url.toLowerCase() !== 'no video') : values.gamesList.filter((game) => game.video_url.toLowerCase() === 'no video');

        return getFilteredGamesList(getBelongedGameList(newList));
    };

    useEffect(() => {
        setValues({ ...values, loading: true });
        GameService.getTeamInitialStanding().then((res) => {
            setStandingList(res);
        });
        GameService.getAllGamesByCoach(null, null, null, null).then((res) => {
            setValues({ ...values, gamesList: getDescGamesList(res), seasonList: getSeasonList(res), teamList: getTeamList(res), leagueList: getLeagueList(res), loading: false });
        });
    }, []);

    console.log('******** ', values.gamesList[0]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!values.loading && (
                <>
                    <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#1a1b1d' }}>Games</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: '#1a1b1d' }}>Period</Typography>
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
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: '#1a1b1d' }}>Season</Typography>
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
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: '#1a1b1d' }}>League</Typography>
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
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500, color: '#1a1b1d' }}>Team</Typography>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                            {Tabs.map((tab, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleTabClick(index)}
                                    sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px', width: 'fit-content', cursor: 'pointer' }}
                                >
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#1a1b1d' }}>{tab}</Typography>
                                    <Box sx={{ width: '100%', height: '2px', backgroundColor: values.curTab === index ? '#0A7304' : '#F8F8F8' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ overflowY: 'auto', maxHeight: '80vh', marginLeft: '24px' }}>
                        <Box sx={{ marginRight: '4px' }}>
                            {getGamesList().map((game, index) => (
                                <Box key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                    <GameListItem
                                        row={game}
                                        isHover={values.hoverIndex === index}
                                        isPending={values.curTab === 1}
                                        updateList={updateGameList}
                                        team={values.teamFilter}
                                        standing={standingList}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Games;
