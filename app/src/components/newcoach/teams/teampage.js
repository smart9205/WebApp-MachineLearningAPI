import { Box, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';

import GameService from '../../../services/game.service';
import TeamPlayers from './tabs/players';
import TeamGames from './tabs/games';
import TeamOverview from './tabs/overview';

const Tabs = ['Overview', 'Summary', 'Stats', 'Games', 'Players Overview', 'Players Stats'];

const TeamPage = () => {
    const params = useParams();
    const [values, setValues] = useState({
        players: [],
        playerStats: [],
        teamName: '',
        teamId: -1,
        seasonId: -1,
        leagueId: -1,
        tabSelected: 0,
        loading: false,
        loadingDone: false
    });
    const [gameList, setGameList] = useState([]);

    const handleClickTab = (idx) => {
        setValues({ ...values, tabSelected: idx });
    };

    useEffect(async () => {
        const pathname = window.location.pathname;

        if (pathname.match(/\/new_coach\/teams\//) !== null) {
            const ids = atob(params.teamId).split('|');
            let stats = [];

            setValues({ ...values, loading: true });
            await GameService.getAllGamesByCoach(ids[1], ids[2], ids[0], null).then((res) => {
                setGameList(res);
            });
            await GameService.getCoachTeamPlayers(ids[0], ids[1], ids[2]).then((res) => {
                stats = res;
            });
            await GameService.getPlayersStatsAdvanced({
                seasonId: ids[1],
                leagueId: `${ids[2]}`,
                gameId: null,
                teamId: `${ids[0]}`,
                playerId: null,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null,
                our: true
            }).then((data) => {
                setValues({ ...values, players: stats, playerStats: data, teamName: stats[0].team_name, loading: false, loadingDone: true, teamId: ids[0], seasonId: ids[1], leagueId: ids[2] });
            });
        }
    }, [params]);

    console.log('Team => ', values.playerStats);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {values.loadingDone && (
                <>
                    <Box sx={{ padding: '24px 24px 24px 48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', 'svg path': { fill: 'black' } }}>
                            <Link to="/new_coach/teams">
                                <ChevronLeftIcon sx={{ width: '32px', height: '32px' }} />
                            </Link>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Team {values.teamName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px', paddingLeft: '56px' }}>
                            {Tabs.map((tab, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', width: 'fit-content', cursor: 'pointer' }}
                                    onClick={() => handleClickTab(index)}
                                >
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{tab}</Typography>
                                    <Box sx={{ height: '2px', width: '100%', backgroundColor: values.tabSelected === index ? '#0A7304' : '#F8F8F8' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    {values.tabSelected === 0 && <TeamOverview games={gameList} teamname={values.teamName} teamId={values.teamId} />}
                    {values.tabSelected === 3 && <TeamGames />}
                    {values.tabSelected === 5 && <TeamPlayers playerList={values.players} stats={values.playerStats} teamId={values.teamId} seasonId={values.seasonId} leagueId={values.leagueId} />}
                </>
            )}
        </Box>
    );
};

export default TeamPage;
