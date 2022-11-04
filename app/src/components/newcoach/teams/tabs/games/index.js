import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import GameService from '../../../../../services/game.service';
import { getComparator, getFormattedDate, stableSort } from '../../../components/utilities';

import '../../../coach_style.css';
import TeamGamesVideoPlayer from './videoDialog';
import { getPeriod } from '../../../games/tabs/overview/tagListItem';
import { ActionData } from '../../../components/common';

const properties = [
    { id: 'total_goal', action: 'Goal' },
    { id: 'total_shot', action: 'GoalKick' },
    { id: 'total_dribble', action: 'Dribble' },
    { id: 'total_crosses', action: 'Cross' },
    { id: 'total_corners', action: 'Corner' },
    { id: 'total_free_kick', action: 'FreeKick' },
    { id: 'total_passes', action: 'Passes' },
    { id: 'total_turnover', action: 'Turnover' },
    { id: 'total_fouls', action: 'Foul' },
    { id: 'total_draw_fouls', action: 'DrawFoul' },
    { id: 'total_interception', action: 'Interception' },
    { id: 'total_tackle', action: 'Tackle' },
    { id: 'total_saved', action: 'Saved' },
    { id: 'total_blocked', action: 'Blocked' },
    { id: 'total_clearance', action: 'Clearance' }
];

const TeamGames = ({ games, gameIds, teamId, seasonId }) => {
    const [teamStatList, setTeamStatList] = useState([]);
    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [videoURL, setVideoURL] = useState('');

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleDisplayVideo = (gameId, tId, prop) => {
        GameService.getGamePlayerTags(currentUser.id, tId, null, `${gameId}`, ActionData[prop].action_id, ActionData[prop].action_type_id, ActionData[prop].action_result_id).then((res) => {
            console.log('team games => ', res);
            setPlayData(
                res.map((item) => {
                    return {
                        start_time: item.player_tag_start_time,
                        end_time: item.player_tag_end_time,
                        player_name: item.player_names,
                        action_name: item.action_names,
                        action_type: item.action_type_names,
                        action_result: item.action_result_names,
                        period: getPeriod(item.period),
                        time: item.time_in_game,
                        home_team_image: item.home_team_logo,
                        away_team_image: item.away_team_logo,
                        home_team_goals: item.home_team_goal,
                        away_team_goals: item.away_team_goal
                    };
                })
            );
            setVideoURL(games.filter((item) => item.id === gameId)[0].video_url);
            setVideoOpen(true);
        });
    };

    const getGameResultImage = (game) => {
        const isOur = game.team_id === game.home_team_id ? 1 : game.team_id === game.away_team_id ? 2 : 0;

        if (isOur !== 0) {
            if (game['total_goal'] > game['opp_total_goal']) {
                if (isOur === 1) return { home: { text: 'W', color: '#52B030' }, away: { text: '', color: 'white' } };
                else return { home: { text: '', color: 'white' }, away: { text: 'W', color: '#52B030' } };
            } else if (game['total_goal'] < game['opp_total_goal']) {
                if (isOur === 1) return { home: { text: 'L', color: '#C1272D' }, away: { text: '', color: 'white' } };
                else return { home: { text: '', color: 'white' }, away: { text: 'L', color: '#C1272D' } };
            } else {
                if (isOur === 1) return { home: { text: 'D', color: '#A4AAB0' }, away: { text: '', color: 'white' } };
                else return { home: { text: '', color: 'white' }, away: { text: 'D', color: '#A4AAB0' } };
            }
        }

        return { home: { text: '', color: 'white' }, away: { text: '', color: 'white' } };
    };

    const getGameGoalsFontStyle = (game) => {
        if (game.team_id === game.home_team_id) return { home: 700, away: 400 };

        return { home: 400, away: 700 };
    };

    useEffect(() => {
        if (gameIds.length > 0) {
            GameService.getTeamsStatsGamebyGame({
                seasonId: seasonId,
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
                        <TableRow height="36px">
                            <TableCell align="center">Game</TableCell>
                            <TableCell align="center" colSpan={2}>
                                Team
                            </TableCell>
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
                                <TableRow key={index} height="36px" hover>
                                    <TableCell key={`${index}-game`} align="center" rowSpan={2} sx={{ borderBottom: '1px solid #0A7304' }}>
                                        <div>
                                            <p className="normal-text">{item.league_name}</p>
                                            <p className="normal-text">{item.season_name}</p>
                                            <p className="normal-text">{getFormattedDate(item.game_date)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell key={`${index}-result`} align="center">
                                        <div
                                            style={{
                                                background: `${getGameResultImage(item)['home'].color}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                        >
                                            <p className="normal-text-white">{getGameResultImage(item)['home'].text}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell key={`${index}-home`} align="center" sx={{ fontWeight: getGameGoalsFontStyle(item).home }}>
                                        {item.home_team_name}
                                    </TableCell>
                                    <TableCell key={`${index}-format`} align="center" sx={{ fontWeight: getGameGoalsFontStyle(item).home }}>
                                        {item.team_formation_name}
                                    </TableCell>
                                    {properties.map((prop) => (
                                        <TableCell
                                            key={`${index}-${prop.id}`}
                                            align="center"
                                            sx={{ cursor: 'pointer', fontWeight: getGameGoalsFontStyle(item).home }}
                                            onClick={() => handleDisplayVideo(item.game_id, item.home_team_id, prop.action)}
                                        >
                                            {item.team_id === item.home_team_id ? item[prop.id] : item[`opp_${prop.id}`]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow key={index + 1} height="36px" hover>
                                    <TableCell key={`${index + 1}-result`} align="center" sx={{ borderBottom: '1px solid #0A7304' }}>
                                        <div
                                            style={{
                                                background: `${getGameResultImage(item)['away'].color}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                        >
                                            <p className="normal-text-white">{getGameResultImage(item)['away'].text}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell key={`${index + 1}-away`} align="center" sx={{ borderBottom: '1px solid #0A7304', fontWeight: getGameGoalsFontStyle(item).away }}>
                                        {item.away_team_name}
                                    </TableCell>
                                    <TableCell key={`${index + 1}-format`} align="center" sx={{ borderBottom: '1px solid #0A7304', fontWeight: getGameGoalsFontStyle(item).away }}>
                                        {item.opponent_formation_name}
                                    </TableCell>
                                    {properties.map((prop) => (
                                        <TableCell
                                            key={`${index + 1}-opp_${prop.id}`}
                                            align="center"
                                            sx={{ borderBottom: '1px solid #0A7304', cursor: 'pointer', fontWeight: getGameGoalsFontStyle(item).away }}
                                            onClick={() => handleDisplayVideo(item.game_id, item.away_team_id, prop.action)}
                                        >
                                            {item.team_id === item.home_team_id ? item[`opp_${prop.id}`] : item[prop.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {videoOpen && <TeamGamesVideoPlayer onClose={() => setVideoOpen(false)} video_url={videoURL} tagList={playData} />}
        </Box>
    );
};

export default TeamGames;
