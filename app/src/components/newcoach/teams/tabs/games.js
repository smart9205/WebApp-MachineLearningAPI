import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import GameService from '../../../../services/game.service';
import { getComparator, getFormattedDate, stableSort } from '../../components/utilities';

import '../../coach_style.css';

const TeamGames = ({ gameIds, teamId }) => {
    const [teamStatList, setTeamStatList] = useState([]);

    useEffect(() => {
        if (gameIds.length > 0) {
            GameService.getTeamsStatsGamebyGame({
                seasonId: null,
                leagueId: null,
                gameId: gameIds.join(','),
                teamId: teamId,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null
            }).then((res) => {
                setTeamStatList(stableSort(res, getComparator('desc', 'game_date')));
            });
        }
    }, [gameIds]);

    console.log('team games => ', teamStatList);

    return (
        <Box sx={{ width: '100%', background: 'white', height: '80vh', display: 'flex', padding: '20px 10px' }}>
            <TableContainer style={{ maxHeight: '80vh' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Game</TableCell>
                            <TableCell align="center">Team</TableCell>
                            <TableCell align="center">Formation</TableCell>
                            <TableCell align="center">Goals</TableCell>
                            <TableCell align="center">Shots</TableCell>
                            <TableCell align="center">Dribbles</TableCell>
                            <TableCell align="center">Crosses</TableCell>
                            <TableCell align="center">Corners</TableCell>
                            <TableCell align="center">Free Kicks</TableCell>
                            <TableCell align="center">Passes</TableCell>
                            <TableCell align="center">Turnovers</TableCell>
                            <TableCell align="center">Fouls</TableCell>
                            <TableCell align="center">Draw Fouls</TableCell>
                            <TableCell align="center">Interceptions</TableCell>
                            <TableCell align="center">Tackles</TableCell>
                            <TableCell align="center">Saved</TableCell>
                            <TableCell align="center">Blocked</TableCell>
                            <TableCell align="center">Clearance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamStatList.map((item, index) => (
                            <>
                                <TableRow key={index}>
                                    <TableCell align="center" rowSpan={2} sx={{ borderBottom: '1px solid #0A7304' }}>
                                        <div>
                                            <p className="normal-text">{item.season_name}</p>
                                            <p className="normal-text">{item.league_name}</p>
                                            <p className="normal-text">{getFormattedDate(item.game_date)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.home_team_name}
                                    </TableCell>
                                    <TableCell align="center" height="36px"></TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_goal}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_shot}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_dribble}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_crosses}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_corners}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_free_kick}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_passes}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_turnover}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_fouls}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_draw_fouls}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_interception}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_tackle}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_saved}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_blocked}
                                    </TableCell>
                                    <TableCell align="center" height="36px">
                                        {item.total_clearance}
                                    </TableCell>
                                </TableRow>
                                <TableRow key={index + 1}>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.away_team_name}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}></TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_goal}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_shot}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_dribble}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_crosses}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_corners}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_free_kick}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_passes}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_turnover}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_fouls}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_draw_fouls}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_interception}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_tackle}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_saved}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_blocked}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #0A7304', height: '36px' }}>
                                        {item.opp_total_clearance}
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TeamGames;
