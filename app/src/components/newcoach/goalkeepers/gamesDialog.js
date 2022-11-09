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
    { id: 'total_goal', title: 'Goals', action: 'Goal' },
    { id: 'total_shot', title: 'Shots', action: 'GoalKick' },
    { id: 'total_dribble', title: 'Dribbles', action: 'Dribble' },
    { id: 'total_crosses', title: 'Crosses', action: 'Cross' },
    { id: 'total_corner', title: 'Corners', action: 'Corner' },
    { id: 'total_free_kick', title: 'Free Kicks', action: 'FreeKick' },
    { id: 'total_passes', title: 'Passes', action: 'Passes' },
    { id: 'total_turnover', title: 'Turnovers', action: 'Turnover' },
    { id: 'total_fouls', title: 'Fouls', action: 'Foul' },
    { id: 'total_draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'total_interception', title: 'Interceptions', action: 'Interception' },
    { id: 'total_tackle', title: 'Tackles', action: 'Tackle' },
    { id: 'total_saved', title: 'Saved', action: 'Saved' },
    { id: 'total_blocked', title: 'Blocked', action: 'Blocked' },
    { id: 'total_clearance', title: 'Clearance', action: 'Clearance' }
];

const PlayersGamesDialog = ({ open, onClose, list, playerName }) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [videoURL, setVideoURL] = useState('');
    const [exportOpen, setExportOpen] = useState(false);

    const handleDisplayVideo = async (cell, prop) => {
        if (cell[prop.id] > 0) {
            let video_url = '';

            await GameService.getGameById(cell.game_id).then((res) => {
                video_url = res.video_url;
            });
            await GameService.getGamePlayerTags(
                currentUser.id,
                cell.team_id,
                `${cell.player_id}`,
                `${cell.game_id}`,
                ActionData[prop.action].action_id,
                ActionData[prop.action].action_type_id,
                ActionData[prop.action].action_result_id
            ).then((res) => {
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
                setVideoURL(video_url);
                setVideoOpen(true);
            });
        }
    };

    const handleExportTags = (cell, prop) => (e) => {
        e.preventDefault();

        if (cell[prop.id] > 0) {
            GameService.getGamePlayerTags(
                currentUser.id,
                cell.team_id,
                `${cell.player_id}`,
                `${cell.game_id}`,
                ActionData[prop.action].action_id,
                ActionData[prop.action].action_type_id,
                ActionData[prop.action].action_result_id
            ).then((res) => {
                setPlayData(res);
                setExportOpen(true);
            });
        }
    };

    const getAwayTeamName = (item) => {
        return item.team_name === item.home_team_name ? item.away_team_name : item.home_team_name;
    };

    console.log('player games => ', list);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="1500px">
            <DialogTitle>{`Games of ${playerName}`}</DialogTitle>
            <DialogContent>
                <TableContainer style={{ maxHeight: '75vh', minWidth: '1200px' }}>
                    <Table stickyHeader aria-label="sticky table">
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
                                    <TableCell key={`${index}-game`} align="center" width="348px">
                                        <div>
                                            <p className="normal-text">{`${item.season_name}, ${item.league_name}`}</p>
                                            <p className="normal-text">{`${getFormattedDate(item.game_date)} VS ${getAwayTeamName(item)}`}</p>
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
                {videoOpen && <TeamGamesVideoPlayer onClose={() => setVideoOpen(false)} video_url={videoURL} tagList={playData} />}
                <GameExportToEdits open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
            </DialogContent>
        </Dialog>
    );
};

export default PlayersGamesDialog;
