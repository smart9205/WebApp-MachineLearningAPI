import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, MenuItem, Select, Typography } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import LeadersPlayerStatColumn from './playerStatColumn';
import { MenuProps } from '../components/common';
import { getComparator, stableSort } from '../components/utilities';

const Leaders = () => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teamList, setTeamList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [leagueList, setLeagueList] = useState([]);
    const [playersList, setPlayersList] = useState([]);
    const [displayOption, setDisplayOption] = useState('total');
    const [values, setValues] = useState({
        teamFilter: 'none',
        seasonFilter: 'none',
        leagueFilter: 'none',
        playerFilter: 'none'
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
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

    const getFilteredList = () => {
        let array = [];

        if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.season_name === values.seasonFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.league_name === values.leagueFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.team_name === values.teamFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter !== 'none')
            array = playerList.filter((item) => item.player_name === values.playerFilter);
        else if (values.seasonFilter !== 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.league_name === values.leagueFilter);
        else if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.team_name === values.teamFilter);
        else if (values.seasonFilter !== 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter !== 'none')
            array = playerList.filter((item) => item.season_name === values.seasonFilter && item.player_name === values.playerFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter !== 'none' && values.playerFilter === 'none')
            array = playerList.filter((item) => item.league_name === values.leagueFilter && item.team_name === values.teamFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter !== 'none' && values.teamFilter === 'none' && values.playerFilter !== 'none')
            array = playerList.filter((item) => item.league_name === values.leagueFilter && item.player_name === values.playerFilter);
        else if (values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter !== 'none' && values.playerFilter !== 'none')
            array = playerList.filter((item) => item.player_name === values.playerFilter && item.team_name === values.teamFilter);
        else
            array = playerList.filter(
                (item) => item.league_name === values.leagueFilter && item.season_name === values.seasonFilter && item.team_name === values.teamFilter && item.player_name === values.playerFilter
            );

        return values.seasonFilter === 'none' && values.leagueFilter === 'none' && values.teamFilter === 'none' && values.playerFilter === 'none' ? playerList : array;
    };

    useEffect(async () => {
        setLoading(true);
        await GameService.getAllLeaguesByCoach().then((res) => {
            setLeagueList(getLeagueList(res));
        });
        await GameService.getAllTeamsByCoach().then((res) => {
            setTeamList(getTeamList(res));
        });
        await GameService.getAllPlayersByCoach().then((res) => {
            setPlayersList(res);
        });
        await GameService.getPlayersStats(null, null, null, null, null).then((res) => {
            setPlayerList(res);
            setSeasonList(getSeasonList(res));
            setLoading(false);
        });
    }, []);

    console.log('leaders => ', playerList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Leaders</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Season</Typography>
                                <Select
                                    value={values.seasonFilter}
                                    onChange={handleChange('seasonFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '150px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                                    value={values.leagueFilter}
                                    onChange={handleChange('leagueFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Team</Typography>
                                <Select
                                    value={values.teamFilter}
                                    onChange={handleChange('teamFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Player</Typography>
                                <Select
                                    value={values.playerFilter}
                                    onChange={handleChange('playerFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '200px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {playersList.map((player, index) => (
                                        <MenuItem key={index + 1} value={player.player_name}>
                                            {player.player_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Display</Typography>
                                <Select
                                    value={displayOption}
                                    onChange={(e) => setDisplayOption(e.target.value)}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ outline: 'none', height: '36px', width: '150px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="total">
                                        Total
                                    </MenuItem>
                                    <MenuItem key="1" value="average">
                                        Average
                                    </MenuItem>
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={true} option="game" title="Games Played" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="goal" title="Goals" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="penalties" title="Penalties" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="penalties_missed" title="Penalties Missed" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="shot" title="Shots" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="shot_on_target" title="Shots On Target" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="shot_off_target" title="Shots Off Target" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="shot_on_box" title="Shots On Box" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="free_kick" title="Free Kicks" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="crosses" title="Crosses" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="dribble" title="Dribbles" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="dribble_successful" title="Dribbles Successful" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="passes" title="Passes" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="successful_passes" title="Passes Successful" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="passes_for_goals" title="Passes For Goals" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="passes_for_shots" title="Passes For Shots" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="own_goals" title="Own Goals" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="key_passes" title="Key Passes" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="through_passes" title="Through Passes" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="through_passes_successful" title="Through Passes Successful" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="offside" title="Offside" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="turnover" title="Turnovers" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="turnover_on_offensive_court" title="Turnovers on Offensive Court" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="turnover_on_defensive_court" title="Turnovers on Defensive Court" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="saved" title="Saved" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="tackle" title="Tackles" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="tackle_on_offensive_court" title="Tackles on Offensive Court" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="tackle_on_defensive_court" title="Tackles on Defensive Court" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="clearance" title="Clearance" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="interception" title="Interceptions" />
                                <LeadersPlayerStatColumn
                                    list={getFilteredList()}
                                    isTotal={displayOption === 'total'}
                                    option="interception_on_offensive_court"
                                    title="Interceptions on Offensive Court"
                                />
                                <LeadersPlayerStatColumn
                                    list={getFilteredList()}
                                    isTotal={displayOption === 'total'}
                                    option="interception_on_defensive_court"
                                    title="Interceptions on Defensive Court"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="fouls" title="Fouls" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="draw_fouls" title="Draw Fouls" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="red_cards" title="Red Cards" />
                                <LeadersPlayerStatColumn list={getFilteredList()} isTotal={displayOption === 'total'} option="yellow_cards" title="Yellow Cards" />
                            </div>
                        </div>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Leaders;
