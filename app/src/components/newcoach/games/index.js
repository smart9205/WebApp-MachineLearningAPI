import { Box, Typography } from '@mui/material';
import React, { useState, useEffect, useReducer } from 'react';
import ProcessedTab from './tabs/ProcessedTab';
import PendingTab from './tabs/PendingTab';
import gameService from '../../../services/game.service';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

const Tabs = ['Processed', 'Pending'];

const Games = () => {
    const { t } = useTranslation();

    const [curTab, setCurTab] = useState(0);
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        team: null,
        teamList: [],
        gameListByCoach: [],
        seasonList: [],
        playerList: [],
        playersInGameList: [],
        game: null,
        allTagList: [],
        opponentTagList: [],
        gameList: []
    });
    const { team, gameListByCoach, teamList, seasonList } = state;

    const [updateGamesList, setUpdateGamesList] = useState(false);

    const [period, setPeriod] = React.useState('all');
    const [seasonFilter, setSeasonFilter] = useState(0);
    const [teamFilter, setTeamFilter] = useState(0);
    const [leagueFilter, setLeagueFilter] = useState(0);

    const [teamSelectionOptions, setTeamSelectionOptions] = useState();
    const [seasonSelectionOptions, setSeasonSelectionOptions] = useState();
    const [leagueSelectionOptions, setLeagueSelectionOptions] = useState();

    useEffect(() => {
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] });
        });
        gameService.getAllSeasons().then((res) => {
            setState({ seasonList: res });
            // setSeasonFilter(res[0]);
        });
    }, []);

    const gettingAllGamesByCoach = () => {
        if (!team) return;
        gameService.getAllGamesByCoach(null, null, null, team.user_id, null).then((res) => {
            setState({ gameListByCoach: res, gameByCoach: res[0] });
        });
    };

    useEffect(() => {
        gettingAllGamesByCoach();
    }, [updateGamesList, team]);

    let teamSelectionFields = [];

    const gettingTeamData = async () => {
        await gameListByCoach.map((teamData) => {
            if (teamData?.home_team_id && teamData?.away_team_id) {
                const isFound = teamSelectionFields.some((el) => {
                    if (el.value === teamData?.home_team_id || el.value === teamData?.away_team_id) {
                        return true;
                    }
                });
                if (isFound) {
                    return;
                } else {
                    teamSelectionFields.push({
                        value: teamData.home_team_id,
                        name: teamData.home_team_name
                    });
                    teamSelectionFields.push({
                        value: teamData.away_team_id,
                        name: teamData.away_team_name
                    });
                }
            }
        });
    };

    let seasonSelectionFields = [];

    const gettingSeasonData = async () => {
        await gameListByCoach.map((seasonData) => {
            if (seasonData?.season_name && seasonData?.season_id) {
                const isFound = seasonSelectionFields.some((el) => {
                    if (el.value === seasonData?.season_id) {
                        return true;
                    }
                });
                if (isFound) {
                    return;
                } else {
                    seasonSelectionFields.push({
                        value: seasonData.season_id,
                        label: seasonData.season_name
                    });
                }
            }
        });
    };

    let leagueSelectionFields = [];

    const gettingLeagueData = async () => {
        await gameListByCoach.map((leagueData) => {
            if (leagueData?.league_name && leagueData?.league_id) {
                const isFound = leagueSelectionFields.some((el) => {
                    if (el.value === leagueData?.league_id) {
                        return true;
                    }
                });
                if (isFound) {
                    return;
                } else {
                    leagueSelectionFields.push({
                        value: leagueData.league_id,
                        label: leagueData.league_name
                    });
                }
            }
        });
    };

    useEffect(() => {
        gettingTeamData();
        gettingSeasonData();
        gettingLeagueData();

        setTeamSelectionOptions({ ...teamSelectionOptions, teamSelectionFields });
        setSeasonSelectionOptions({ ...seasonSelectionOptions, seasonSelectionFields });
        setLeagueSelectionOptions({ ...leagueSelectionOptions, leagueSelectionFields });
    }, [gameListByCoach, teamFilter, seasonFilter, leagueFilter]);

    const handleChange = (event) => {
        setPeriod(event.target.value);
    };

    return (
        <>
            <Box sx={{ minWidth: '95%', margin: '0 auto' }}>
                <Box sx={{ padding: '24px 24px 21px 48px' }}>
                    <Typography sx={{ fontFamily: 'sans-serif', fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Games</Typography>
                    <Box sx={{ display: 'flex', marginTop: '24px', alignItems: 'center', gap: '24px' }}>
                        {Tabs.map((title, index) => (
                            <Box
                                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'fit-content', gap: '4px', cursor: 'pointer', fontFamily: 'sans-serif' }}
                                onClick={() => setCurTab(index)}
                                key={index}
                            >
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: curTab === index ? 'black' : '#A5A5A8' }}>{title}</Typography>
                                <Box sx={{ height: '2px', width: '100%', backgroundColor: curTab === index ? 'red' : '#F8F8F8' }} />
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', gap: '2rem', marginLeft: '4rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>Period</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={period}
                                        onChange={handleChange}
                                        variant="outlined"
                                        label=""
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ borderRadius: '5px', height: '36px', width: '160px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value={'last-week'}>Last week</MenuItem>
                                        <MenuItem value={'last-month'}>Last month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>Team</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={teamFilter}
                                        onChange={(e) => setTeamFilter(e.target.value)}
                                        label=""
                                        variant="outlined"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ outline: 'none', height: '36px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem value="0">All</MenuItem>

                                        {teamSelectionOptions?.teamSelectionFields &&
                                            teamSelectionOptions?.teamSelectionFields?.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>Season</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={seasonFilter}
                                        onChange={(event) => {
                                            setSeasonFilter(event.target.value);
                                        }}
                                        label=""
                                        variant="outlined"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ outline: 'none', height: '36px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem value="0">All</MenuItem>

                                        {seasonSelectionOptions?.seasonSelectionFields &&
                                            seasonSelectionOptions?.seasonSelectionFields?.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>League</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={leagueFilter}
                                        onChange={(e) => setLeagueFilter(e.target.value)}
                                        label=""
                                        variant="outlined"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ outline: 'none', height: '36px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem value="0">All</MenuItem>

                                        {leagueSelectionOptions?.leagueSelectionFields &&
                                            leagueSelectionOptions?.leagueSelectionFields?.map((option, index) => (
                                                <MenuItem key={index} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {curTab === 0 && (
                    <ProcessedTab
                        allGamesList={gameListByCoach}
                        period={period}
                        seasonFilter={seasonFilter}
                        teamFilter={teamFilter}
                        leagueFilter={leagueFilter}
                        setSeasonFilter={setSeasonFilter}
                        setTeamFilter={setTeamFilter}
                        setLeagueFilter={setLeagueFilter}
                        teamList={teamList}
                        setState={setState}
                        t={t}
                    />
                )}

                {curTab === 1 && <PendingTab allGamesList={gameListByCoach} setUpdateGamesList={setUpdateGamesList} />}
            </Box>
        </>
    );
};

export default Games;
