import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getFormattedDate } from '../components/utilities';
import GameService from '../../../services/game.service';
import { ActionData } from '../components/common';
import { getPeriod } from '../games/tabs/overview/tagListItem';
import TeamGamesVideoPlayer from '../teams/tabs/games/videoDialog';

import '../coach_style.css';
import GameExportToEdits from '../games/tabs/overview/exportEdits';

const properties = [
    { id: 'total_passes', title: 'Passes', action: 'Passes' },
    { id: 'total_successful_passes', title: 'Successful Passes', action: 'PassesSuccess' },
    { id: 'total_short_passes', title: 'Short Passes', action: 'ShortPass' },
    { id: 'total_long_passes', title: 'Long Passes', action: 'LongPass' },
    { id: 'total_build_ups', title: 'Build Ups', action: 'BuildUp' },
    { id: 'total_super_save', title: 'Super Saved', action: 'SuperSaved' },
    { id: 'total_saved', title: 'Saved', action: 'Saved' },
    { id: 'total_goalkeeper_exit', title: 'Exits', action: 'Exits' },
    { id: 'total_air_challenge', title: 'Air Challenges', action: 'AirChallenge' },
    { id: 'total_ground_challenge', title: 'Ground Challenges', action: 'GroundChallenge' },
    { id: 'total_one_vs_one', title: '1vs1', action: 'One' },
    { id: 'total_goal_received', title: 'Goals Received', action: 'GoalReceive' },
    { id: 'total_interception', title: 'Interceptions', action: 'Interception' },
    { id: 'total_clearance', title: 'Clearance', action: 'Clearance' },
    { id: 'total_fouls', title: 'Fouls', action: 'Foul' },
    { id: 'total_draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'total_opponent_crosses', title: 'Opponents Crosses', action: 'Cross' },
    { id: 'total_opponent_corners', title: 'Opponents Corners', action: 'Corner' },
    { id: 'total_opponent_free_kicks', title: 'Opponents Free-Kicks', action: 'FreeKick' }
];

const GoalkeepersGamesDialog = ({ open, onClose, list, playerName, teamId }) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [videoURL, setVideoURL] = useState('');
    const [exportOpen, setExportOpen] = useState(false);

    const handleDisplayVideo = async (cell, prop) => {
        if (cell[prop.id] > 0 && prop.action !== '') {
            let video_url = '';

            await GameService.getGameById(cell.game_id).then((res) => {
                video_url = res.video_url;
            });

            if (prop.title.includes('Opponents')) {
                await GameService.getOpponentTags(
                    currentUser.id,
                    cell.team_id,
                    null,
                    `${cell.game_id}`,
                    ActionData[prop.action].action_id,
                    ActionData[prop.action].action_type_id,
                    ActionData[prop.action].action_result_id,
                    null,
                    null,
                    null
                ).then((res) => {
                    setPlayData(
                        res.map((item) => {
                            return {
                                tag_id: item.id,
                                start_time: item.player_tag_start_time,
                                end_time: item.player_tag_end_time,
                                player_name: item.player_names,
                                action_name: item.action_names,
                                action_type: item.action_type_names,
                                action_result: item.action_result_names,
                                game_id: item.game_id,
                                team_id: teamId,
                                court_area: item.court_area_id,
                                inside_pain: item.inside_the_pain,
                                period: getPeriod(item.period),
                                time: item.time_in_game,
                                home_team_image: item.home_team_logo,
                                away_team_image: item.away_team_logo,
                                home_team_goals: item.home_team_goal,
                                away_team_goals: item.away_team_goal
                            };
                        })
                    );
                    setVideoURL(video_url);

                    if (res.length > 0) setVideoOpen(true);
                });
            } else {
                await GameService.getGamePlayerTags(
                    currentUser.id,
                    cell.team_id,
                    `${cell.player_id}`,
                    `${cell.game_id}`,
                    ActionData[prop.action].action_id,
                    ActionData[prop.action].action_type_id,
                    ActionData[prop.action].action_result_id,
                    null,
                    null,
                    null
                ).then((res) => {
                    const flist = cell.title === 'Exits' ? res.filter((item) => item.inside_the_pain === false) : res;

                    setPlayData(
                        flist.map((item) => {
                            return {
                                tag_id: item.id,
                                start_time: item.player_tag_start_time,
                                end_time: item.player_tag_end_time,
                                player_name: item.player_names,
                                action_name: item.action_names,
                                action_type: item.action_type_names,
                                action_result: item.action_result_names,
                                game_id: item.game_id,
                                team_id: teamId,
                                court_area: item.court_area_id,
                                inside_pain: item.inside_the_pain,
                                period: getPeriod(item.period),
                                time: item.time_in_game,
                                home_team_image: item.home_team_logo,
                                away_team_image: item.away_team_logo,
                                home_team_goals: item.home_team_goal,
                                away_team_goals: item.away_team_goal
                            };
                        })
                    );
                    setVideoURL(video_url);

                    if (flist.length > 0) setVideoOpen(true);
                });
            }
        }
    };

    const handleExportTags = (cell, prop) => (e) => {
        e.preventDefault();

        if (cell[prop.id] > 0 && prop.action !== '') {
            if (prop.title.includes('Opponents')) {
                GameService.getOpponentTags(
                    currentUser.id,
                    cell.team_id,
                    null,
                    `${cell.game_id}`,
                    ActionData[prop.action].action_id,
                    ActionData[prop.action].action_type_id,
                    ActionData[prop.action].action_result_id,
                    null,
                    null,
                    null
                ).then((res) => {
                    setPlayData(res);

                    if (res.length > 0) setExportOpen(true);
                });
            } else {
                GameService.getGamePlayerTags(
                    currentUser.id,
                    cell.team_id,
                    `${cell.player_id}`,
                    `${cell.game_id}`,
                    ActionData[prop.action].action_id,
                    ActionData[prop.action].action_type_id,
                    ActionData[prop.action].action_result_id,
                    null,
                    null,
                    null
                ).then((res) => {
                    const flist = cell.title === 'Exits' ? res.filter((item) => item.inside_the_pain === false) : res;

                    setPlayData(flist);

                    if (flist.length > 0) setExportOpen(true);
                });
            }
        }
    };

    const getAwayTeamName = (item) => {
        return item.team_name === item.home_team_name ? item.away_team_name : item.home_team_name;
    };

    console.log('goalkeeper/games => ', list);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl">
            <DialogTitle>{`Games of ${playerName}`}</DialogTitle>
            <DialogContent>
                <TableContainer style={{ maxHeight: '75vh', minWidth: '1200px' }}>
                    <Table stickyHeader aria-label="sticky table" sx={{ '& .MuiTableCell-root': { padding: '4px !important' } }}>
                        <TableHead>
                            <TableRow height="36px">
                                <TableCell key="0" align="center">
                                    Game
                                </TableCell>
                                {properties.map((item, index) => (
                                    <TableCell key={index + 1} align="center">
                                        {item.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((item, index) => (
                                <TableRow key={index} height="36px" hover>
                                    <TableCell key={`${index}-game`} align="center" width="240px">
                                        <div>
                                            <p className="normal-text">{`${item.season_name}, ${item.league_name}`}</p>
                                            <p className="normal-text">{`${getFormattedDate(item.game_date)} vs ${getAwayTeamName(item)}`}</p>
                                        </div>
                                    </TableCell>
                                    {properties.map((prop) => (
                                        <TableCell
                                            key={`${index}-${prop.id}`}
                                            align="center"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => handleDisplayVideo(item, prop)}
                                            onContextMenu={handleExportTags(item, prop)}
                                        >
                                            {item[prop.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TeamGamesVideoPlayer open={videoOpen} onClose={() => setVideoOpen(false)} video_url={videoURL} tagList={playData} />
                <GameExportToEdits open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
            </DialogContent>
        </Dialog>
    );
};

export default GoalkeepersGamesDialog;
