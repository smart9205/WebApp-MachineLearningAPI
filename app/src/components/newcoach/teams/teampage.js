import { Box, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';

import GameService from '../../../services/game.service';
import TeamPlayers from './tabs/players';
import TeamGames from './tabs/games';
import TeamOverview from './tabs/overview';

const Tabs = ['Overview', 'Summary', 'Stats', 'Games', 'Players'];

const TeamPage = () => {
    const params = useParams();
    const [values, setValues] = useState({
        players: [],
        teamName: '',
        tabSelected: 0,
        loading: false,
        loadingDone: false
    });

    const handleClickTab = (idx) => {
        setValues({ ...values, tabSelected: idx });
    };

    useEffect(() => {
        const pathname = window.location.pathname;

        if (pathname.match(/\/new_coach\/teams\//) !== null) {
            setValues({ ...values, loading: true });
            GameService.getCoachTeamPlayers(atob(params.teamId).split('|')[0], atob(params.teamId).split('|')[1]).then((res) => {
                setValues({ ...values, players: res, teamName: res[0].team_name, loading: false, loadingDone: true });
            });
        }
    }, [params]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <Box sx={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', 'svg path': { fill: 'black' } }}>
                <Link to="/new_coach/teams">
                    <ChevronLeftIcon sx={{ width: '32px', height: '32px' }} />
                </Link>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>{values.teamName}</Typography>
            </Box>
            {values.loadingDone && (
                <Box sx={{ maxHeight: '85vh', width: '80vh', backgroundColor: 'white', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                        {Tabs.map((tab, index) => (
                            <Box
                                key={index}
                                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', width: 'fit-content', cursor: 'pointer' }}
                                onClick={() => handleClickTab(index)}
                            >
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{tab}</Typography>
                                <Box sx={{ height: '2px', width: '100%', backgroundColor: values.tabSelected === index ? '#0A7304' : 'white' }} />
                            </Box>
                        ))}
                    </Box>
                    {values.tabSelected === 0 && <TeamOverview />}
                    {values.tabSelected === 3 && <TeamGames />}
                    {values.tabSelected === 4 && <TeamPlayers playerList={values.players} />}
                </Box>
            )}
        </Box>
    );
};

export default TeamPage;
