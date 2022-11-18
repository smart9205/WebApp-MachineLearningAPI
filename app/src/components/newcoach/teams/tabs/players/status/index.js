import { Box, Button, Dialog, DialogContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import MatchAll from '../../../../../../assets/match_all.png';

import { USER_IMAGE_DEFAULT } from '../../../../../../common/staticData';
import { getFormattedDate } from '../../../../components/utilities';
import GameService from '../../../../../../services/game.service';
import { ActionData } from '../../../../components/common';
import TeamStatsVideoPlayer from '../../stats/videoDialog';
import GameExportToEdits from '../../../../games/tabs/overview/exportEdits';
import { getPeriod } from '../../../../games/tabs/overview/tagListItem';
import GamePlayerStatErrorMessage from '../../../../games/tabs/players/status/errorMessage';

const statList = [
    { id: 'goal', title: 'Goals', action: 'Goal' },
    { id: 'shot', title: 'Shots', action: 'GoalKick' },
    { id: 'penalties', title: 'Penalties', action: 'Penalty' },
    { id: 'penalties_missed', title: 'Penalties Missed', action: 'PenaltyMissed' },
    { id: 'shot_on_target', title: 'Shots On Target', action: 'GoalOpportunity' },
    { id: 'shot_off_target', title: 'Shots Off Target', action: 'ShotOffTarget' },
    { id: 'shot_on_box', title: 'Shots In The Box', action: 'GoalKick' },
    { id: 'shot_out_of_box', title: 'Shots Out Of The Box', action: 'GoalKick' },
    { id: 'dribble', title: 'Dribbles', action: 'Dribble' },
    { id: 'dribble_successful', title: 'Successful Dribbles', action: 'DribbleSuccess' },
    { id: 'crosses', title: 'Crosses', action: 'Cross' },
    { id: 'free_kick', title: 'Free Kicks', action: 'FreeKick' },
    { id: 'corner', title: 'Corners', action: 'Corner' },
    { id: 'passes', title: 'Passes', action: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes', action: 'PassesSuccess' },
    { id: 'passes_for_shots', title: 'Passes For Shots', action: 'PassesShots' },
    { id: 'key_passes', title: 'Key Passes', action: 'KeyPass' },
    { id: 'through_passes', title: 'Through Passes', action: 'ThroughPass' },
    { id: 'turnover', title: 'Turnovers', action: 'Turnover' },
    { id: 'offside', title: 'Offsides', action: 'Offside' },
    { id: 'draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'tackle', title: 'Tackles', action: 'Tackle' },
    { id: 'interception', title: 'Interceptions', action: 'Interception' },
    { id: 'saved', title: 'Saved', action: 'Saved' },
    { id: 'clearance', title: 'Clearance', action: 'Clearance' },
    { id: 'blocked', title: 'Blocked', action: 'Blocked' },
    { id: 'fouls', title: 'Fouls', action: 'Foul' },
    { id: 'yellow_cards', title: 'Yellow Cards', action: 'YellowCard' },
    { id: 'red_cards', title: 'Red Cards', action: 'RedCard' },
    { id: 'player_games', title: 'Games' }
];

const goalkeeper = [
    { id: 'passes', title: 'Passes', action: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes', action: 'PassesSuccess' },
    { id: 'short_passes', title: 'Short Passes', action: 'ShortPass' },
    { id: 'long_passes', title: 'Long Passes', action: 'LongPass' },
    { id: 'build_ups', title: 'Build Ups', action: 'BuildUp' },
    { id: 'super_save', title: 'Super Saved', action: 'SuperSaved' },
    { id: 'saved', title: 'Saved', action: 'Saved' },
    { id: 'goalkeeper_exit', title: 'Exits', action: 'Exits' },
    { id: 'air_challenge', title: 'Air Challenges', action: 'AirChallenge' },
    { id: 'ground_challenge', title: 'Ground Challenges', action: 'GroundChallenge' },
    { id: 'one_vs_one', title: '1 vs 1', action: 'One' },
    { id: 'goal_received', title: 'Goals Received', action: 'GoalReceive' },
    { id: 'tackle', title: 'Tackles', action: 'Tackle' },
    { id: 'interception', title: 'Interceptions', action: 'Interception' },
    { id: 'clearance', title: 'Clearance', action: 'Clearance' },
    { id: 'fouls', title: 'Fouls', action: 'Foul' },
    { id: 'draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'red_cards', title: 'Red Cards', action: 'RedCard' },
    { id: 'yellow_cards', title: 'Yellow Cards', action: 'YellowCard' },
    { id: 'player_games', title: 'Games Played', action: '' }
];

const TeamPlayerStatDialog = ({ open, onClose, player, teamId, seasonId, games, gameIds, initialState }) => {
    const [playerState, setPlayerState] = useState(null);
    const [gameHalf, setGameHalf] = useState(['first', 'second']);
    const [gameTime, setGameTime] = useState(['1', '2', '3', '4', '5', '6']);
    const [loading, setLoading] = useState(false);
    const [courtArea, setCourtArea] = useState(['1', '2', '3', '4']);
    const [errorOpen, setErrorOpen] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [gamePlace, setGamePlace] = useState(null);
    const [playData, setPlayData] = useState([]);
    const [gameList, setGameList] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleChangeGameHalf = (e, newHalf) => {
        setGameHalf(newHalf);

        if (newHalf.length === 2) setGameTime(['1', '2', '3', '4', '5', '6']);
        else if (newHalf.length === 1) {
            if (newHalf.includes('first')) {
                let newList = [...gameTime];

                newList = newList.filter((item) => item === '4' || item === '5' || item === '6');

                if (newList.length === 3) newList = ['1', '2', '3'];
                else {
                    if (!newList.includes('1')) newList = [...newList, '1'];
                    if (!newList.includes('2')) newList = [...newList, '2'];
                    if (!newList.includes('3')) newList = [...newList, '3'];
                }

                setGameTime(newList);
            } else if (newHalf.includes('second')) {
                let newList = [...gameTime];

                newList = newList.filter((item) => item === '1' || item === '2' || item === '3');

                if (newList.length === 3) newList = ['4', '5', '6'];
                else {
                    if (!newList.includes('4')) newList = [...newList, '4'];
                    if (!newList.includes('5')) newList = [...newList, '5'];
                    if (!newList.includes('6')) newList = [...newList, '6'];
                }

                setGameTime(newList);
            }
        } else {
            if (e.target.innerText === '1 HALF') setGameTime(gameTime.filter((item) => item === '4' || item === '5' || item === '6'));
            else if (e.target.innerText === '2 HALF') setGameTime(gameTime.filter((item) => item === '1' || item === '2' || item === '3'));
        }
    };

    const handleChangeGameTime = (e, newTime) => {
        setGameTime(newTime);

        if (newTime.length === 6) setGameHalf(['first', 'second']);
        else if (newTime.length >= 0 && newTime.length <= 2) setGameHalf([]);
        else if (newTime.length >= 3 && newTime.length <= 5) {
            const diff1 = ['1', '2', '3'].filter((item) => !newTime.includes(item));
            const diff2 = ['4', '5', '6'].filter((item) => !newTime.includes(item));

            if (diff1.length === 0) setGameHalf(['first']);
            if (diff2.length === 0) setGameHalf(['second']);
            if (diff1.length !== 0 && diff2.length !== 0) setGameHalf([]);
        }
    };

    const handleChangeGameResult = (e, newResult) => {
        setGameResult(newResult);
    };

    const handleChangeGamePlace = (e, newPlace) => {
        setGamePlace(newPlace);
    };

    const getPlayerStat = (id) => {
        if (id === 'player_games') return playerState[`total_${id}`];

        return playerState[`total_${id}`] + ' (' + playerState[`average_${id}`] + ')';
    };

    const handleChangeCourtArea = (courtId) => {
        let newList = [...courtArea];

        if (newList.includes(courtId)) newList = newList.filter((item) => item !== courtId);
        else newList = [...newList, courtId];

        setCourtArea(newList);
    };

    const handlePlayerStat = () => {
        if (gameTime.length === 0 || courtArea.length === 0) {
            setErrorOpen(true);

            return;
        }

        setLoading(true);

        if (player.pos_name === 'Goalkeeper') {
            GameService.getGoalkeepersStatsAdvanceSummary({
                seasonId: seasonId,
                leagueId: null,
                gameId: gameIds.length === 0 ? null : gameIds.join(','),
                teamId: teamId,
                playerId: player.id,
                gameTime: gameTime.join(','),
                courtAreaId: courtArea.join(','),
                insidePaint: null,
                homeAway: gamePlace ? parseInt(gamePlace) : null,
                gameResult: gameResult ? parseInt(gameResult) : null
            }).then((res) => {
                setPlayerState(res[0]);
                setLoading(false);
            });
        } else {
            GameService.getPlayersStatsAdvanced({
                seasonId: seasonId,
                leagueId: null,
                gameId: gameIds.length === 0 ? null : gameIds.join(','),
                teamId: teamId,
                playerId: player.id,
                gameTime: gameTime.join(','),
                courtAreaId: courtArea.join(','),
                insidePaint: null,
                homeAway: gamePlace ? parseInt(gamePlace) : null,
                gameResult: gameResult ? parseInt(gameResult) : null
            }).then((res) => {
                setPlayerState(res[0]);
                setLoading(false);
            });
        }
    };

    const handleDisplayVideo = (cell) => {
        if (playerState && playerState[`total_${cell.id}`] > 0 && cell.title !== 'Games') {
            GameService.getGamePlayerTags(
                currentUser.id,
                teamId,
                `${player.id}`,
                gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id
            ).then((res) => {
                let data = res;

                if (cell.title === 'Shots In The Box') data = res.filter((item) => item.inside_the_pain === true);
                else if (cell.title === 'Shots Out Of The Box') data = res.filter((item) => item.inside_the_pain === false);

                setPlayData(
                    data.map((item) => {
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
                setVideoOpen(true);
            });
        }
    };

    const handleExportTags = (cell) => (e) => {
        e.preventDefault();

        if (playerState && playerState[`total_${cell.id}`] > 0 && cell.title !== 'Games') {
            GameService.getGamePlayerTags(
                currentUser.id,
                teamId,
                `${player.id}`,
                gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id
            ).then((res) => {
                let data = res;

                if (cell.title === 'Shots In The Box') data = res.filter((item) => item.inside_the_pain === true);
                else if (cell.title === 'Shots Out Of The Box') data = res.filter((item) => item.inside_the_pain === false);

                setPlayData(data);
                setExportOpen(true);
            });
        }
    };

    const getStatList = () => {
        if (player) return player.pos_name === 'Goalkeeper' ? goalkeeper : statList;

        return statList;
    };

    useEffect(() => {
        setPlayerState(initialState);
        setGameHalf(['first', 'second']);
        setGameTime(['1', '2', '3', '4', '5', '6']);
        setCourtArea(['1', '2', '3', '4']);
    }, [initialState, open]);

    useEffect(() => {
        setGameList(games.filter((item) => gameIds.includes(item.id)));
    }, [games, gameIds]);

    useEffect(() => {
        if (player && gameIds.length > 0) {
            setLoading(true);

            if (player.pos_name === 'Goalkeeper') {
                GameService.getGoalkeepersStatsAdvanceSummary({
                    seasonId: seasonId,
                    leagueId: null,
                    gameId: gameIds.length === 0 ? null : gameIds.join(','),
                    teamId: teamId,
                    playerId: player?.id ?? null,
                    gameTime: gameTime.join(','),
                    courtAreaId: courtArea.join(','),
                    insidePaint: null,
                    homeAway: gamePlace ? parseInt(gamePlace) : null,
                    gameResult: gameResult ? parseInt(gameResult) : null
                }).then((res) => {
                    setPlayerState(res[0]);
                    setLoading(false);
                });
            } else {
                GameService.getPlayersStatsAdvanced({
                    seasonId: seasonId,
                    leagueId: null,
                    gameId: gameIds.length === 0 ? null : gameIds.join(','),
                    teamId: teamId,
                    playerId: player?.id ?? null,
                    gameTime: gameTime.join(','),
                    courtAreaId: courtArea.join(','),
                    insidePaint: null,
                    homeAway: gamePlace ? parseInt(gamePlace) : null,
                    gameResult: gameResult ? parseInt(gameResult) : null
                }).then((res) => {
                    setPlayerState(res[0]);
                    setLoading(false);
                });
            }
        }
    }, [refresh]);

    console.log('$$$$$', playerState);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="1500px">
            <DialogContent style={{ padding: '16px', display: 'flex', gap: '24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Box sx={{ border: '1px solid #E8E8E8', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', borderRadius: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>PROFILE</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '460px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '120px', height: '120px' }}>
                                <img src={player?.image ? player?.image : USER_IMAGE_DEFAULT} style={{ borderRadius: '12px', height: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>First name</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.f_name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Last name</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.l_name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Jersey Number</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.jersey_number ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Position</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.pos_name ?? ''}</Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>Birth date</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>
                                        {getFormattedDate(player?.date_of_birth ?? '1970-01-01')}
                                    </Typography>
                                </div>
                            </div>
                        </Box>
                    </Box>
                    <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>FILTERS</Typography>
                            <Button variant="outlined" color="success" sx={{ textTransform: 'none' }} onClick={() => handlePlayerStat()}>
                                Recalculate
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>MATCH PERIOD</Typography>
                            <div style={{ width: '100%' }}>
                                <ToggleButtonGroup color="success" fullWidth size="small" value={gameHalf} onChange={handleChangeGameHalf}>
                                    <ToggleButton value="first">1 HALF</ToggleButton>
                                    <ToggleButton value="second">2 HALF</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup color="success" fullWidth size="small" value={gameTime} onChange={handleChangeGameTime}>
                                    <ToggleButton value="1">1-15'</ToggleButton>
                                    <ToggleButton value="2">16-30'</ToggleButton>
                                    <ToggleButton value="3">31-45'+</ToggleButton>
                                    <ToggleButton value="4">46-60'</ToggleButton>
                                    <ToggleButton value="5">61-75'</ToggleButton>
                                    <ToggleButton value="6">76-90'+</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '150px',
                                    width: '272px',
                                    borderRadius: '12px',
                                    background: `url(${MatchAll}) center center / cover no-repeat silver`
                                }}
                            >
                                {['4', '3', '2', '1'].map((court, index) => (
                                    <div
                                        key={`${index}-${court}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            borderRadius: index === 0 ? '12px 0 0 12px' : index === 3 ? '0 12px 12px 0' : 0,
                                            height: '100%',
                                            cursor: 'pointer',
                                            background: courtArea.includes(court) ? 'rgba(200, 200, 200, 0)' : 'rgba(200, 200, 200, 0.7)',
                                            border: '1px solid white'
                                        }}
                                        onClick={() => handleChangeCourtArea(court)}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>GAME RESULT</Typography>
                                    <ToggleButtonGroup exclusive color="success" fullWidth size="small" value={gameResult} onChange={handleChangeGameResult}>
                                        <ToggleButton value="1">Won</ToggleButton>
                                        <ToggleButton value="2">Draw</ToggleButton>
                                        <ToggleButton value="3">Lose</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>GAME PLACE</Typography>
                                    <ToggleButtonGroup exclusive color="success" fullWidth size="small" value={gamePlace} onChange={handleChangeGamePlace}>
                                        <ToggleButton value="1">Home</ToggleButton>
                                        <ToggleButton value="2">Away</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>PLAYER STATS</Typography>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '8px' }}>
                        {getStatList().map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    padding: '6px 0',
                                    width: '160px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    border: '1px solid #E8E8E8',
                                    background: loading ? 'white' : playerState ? (playerState[`total_${item.id}`] > 0 ? '#F2F7F2' : 'white') : 'white',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleDisplayVideo(item)}
                                onContextMenu={handleExportTags(item)}
                            >
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>
                                    {!loading ? (playerState ? getPlayerStat(item.id) : '0') : '0'}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Box>
            </DialogContent>
            <GamePlayerStatErrorMessage open={errorOpen} onClose={() => setErrorOpen(false)} />
            <TeamStatsVideoPlayer
                open={videoOpen}
                onClose={(flag) => {
                    setVideoOpen(false);

                    if (flag) setRefresh((r) => !r);
                }}
                video_url={gameList}
                tagList={playData}
            />
            <GameExportToEdits open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
        </Dialog>
    );
};

export default TeamPlayerStatDialog;
