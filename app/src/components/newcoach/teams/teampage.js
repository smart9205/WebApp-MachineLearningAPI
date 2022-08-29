import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

import GameService from '../../../services/game.service';
import { LoadingProgress } from '../components/common';

const Tabs = ['Players', 'Games'];

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
            GameService.getCoachTeamPlayers(params.teamId, params.seasonId).then((res) => {
                setValues({ ...values, players: res, teamName: res[0].team_name, loading: false, loadingDone: true });
            });
        }
    }, [params.teamId, params.seasonId]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', 'svg path': { fill: 'black' } }}>
                <Link to="/new_coach/teams">
                    <ChevronLeftIcon sx={{ width: '32px', height: '32px' }} />
                </Link>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>{values.teamName}</Typography>
            </Box>
            {values.loadingDone && (
                <Box sx={{ maxHeight: '85vh', width: '80vh', backgroundColor: 'white', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                        {Tabs.map((tab, index) => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', width: 'fit-content', cursor: 'pointer' }} onClick={() => handleClickTab(index)}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{tab}</Typography>
                                <Box sx={{ height: '2px', width: '100%', backgroundColor: values.tabSelected === index ? '#0A7304' : 'white' }} />
                            </Box>
                        ))}
                    </Box>
                    {values.tabSelected === 0 && (
                        <Box sx={{ maxHeight: 'calc(85vh - 60px)', overflowY: 'auto' }}>
                            <Box sx={{ marginRight: '16px' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="55%" align="center" colSpan={2}>
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Name</Typography>
                                                </TableCell>
                                                <TableCell width="15%" align="center">
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Age</Typography>
                                                </TableCell>
                                                <TableCell width="15%" align="center">
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Position</Typography>
                                                </TableCell>
                                                <TableCell width="15%" align="center">
                                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Games</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values.players &&
                                                values.players.map((player) => (
                                                    <TableRow height="70px">
                                                        <TableCell width="5%" align="center">
                                                            <img style={{ height: '48px' }} alt="Player Logo" src={player.image.length > 0 ? player.image : PLAYER_ICON_DEFAULT} />
                                                        </TableCell>
                                                        <TableCell width="50%">
                                                            <Box sx={{ paddingLeft: '16px' }}>
                                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>{player.name}</Typography>
                                                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#a5a5a8' }}>
                                                                    #{player.jersey_number}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell width="15%" align="center">
                                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>-</Typography>
                                                        </TableCell>
                                                        <TableCell width="15%" align="center">
                                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{player.pos_name}</Typography>
                                                        </TableCell>
                                                        <TableCell width="15%" align="center">
                                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>-</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
            {values.loading && <LoadingProgress />}
        </Box>
    );
};

export default TeamPage;
