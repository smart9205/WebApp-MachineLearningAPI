import { Box, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';

import GameService from '../../../services/game.service';
import TeamGames from './tabs/games';
import TeamOverview from './tabs/overview';
import TeamPlayersStats from './tabs/players';
import TeamPlayersOverview from './tabs/player_overview';
import '../coach_style.css';
import GameSelectControl from './tabs/overview/gameSelectControl';
import TeamStats from './tabs/stats';

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
        loading: false,
        loadingDone: false
    });
    const [gameList, setGameList] = useState([]);
    const [gameIds, setGameIds] = useState([]);
    const [curTab, setCurTab] = useState(0);

    useEffect(async () => {
        const pathname = window.location.pathname;

        if (pathname.match(/\/new_coach\/teams\//) !== null) {
            const ids = atob(params.teamId).split('|');

            setValues({ ...values, loading: true });
            await GameService.getAllGamesByCoach(ids[1], null, ids[0], null).then((res) => {
                setGameList(res);
            });
            await GameService.getCoachTeamPlayers(ids[0], ids[1], ids[2]).then((res) => {
                setValues({ ...values, players: res, teamName: res[0].team_name, loading: false, loadingDone: true, teamId: ids[0], seasonId: ids[1], leagueId: ids[2] });
            });
        }
    }, [params]);

    useEffect(() => {
        if (gameIds.length > 0) {
            GameService.getPlayersStatsAdvanced({
                seasonId: values.seasonId,
                leagueId: null,
                gameId: gameIds.join(','),
                teamId: `${values.teamId}`,
                playerId: null,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null
            }).then((data) => {
                setValues({ ...values, playerStats: data });
            });
        }
    }, [gameIds]);

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
                    <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', 'svg path': { fill: 'black' } }}>
                            <Link to="/new_coach/teams">
                                <ChevronLeftIcon sx={{ width: '32px', height: '32px' }} />
                            </Link>
                            <p className="page-title">Team {values.teamName}</p>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px', paddingLeft: '56px' }}>
                            {Tabs.map((tab, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', width: 'fit-content', cursor: 'pointer' }}
                                    onClick={() => setCurTab(index)}
                                >
                                    <p className="page-tab">{tab}</p>
                                    <Box sx={{ height: '2px', width: '100%', backgroundColor: curTab === index ? '#0A7304' : '#F8F8F8' }} />
                                </Box>
                            ))}
                            <GameSelectControl gameList={gameList} setIds={setGameIds} />
                        </Box>
                    </Box>
                    {curTab === 0 && <TeamOverview games={gameList} gameIds={gameIds} teamname={values.teamName} teamId={values.teamId} />}
                    {curTab === 2 && <TeamStats games={gameList} gameIds={gameIds} teamId={values.teamId} />}
                    {curTab === 3 && <TeamGames games={gameList} gameIds={gameIds} teamId={values.teamId} seasonId={values.seasonId} />}
                    {curTab === 4 && <TeamPlayersOverview games={gameList} gameIds={gameIds} teamId={values.teamId} />}
                    {curTab === 5 && <TeamPlayersStats playerList={values.players} stats={values.playerStats} teamId={values.teamId} seasonId={values.seasonId} gameIds={gameIds} games={gameList} />}
                </>
            )}
        </Box>
    );
};

export default TeamPage;
