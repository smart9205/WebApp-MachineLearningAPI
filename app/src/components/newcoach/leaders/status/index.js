import { Box, Button, Dialog, DialogContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import MatchAll from '../../../../assets/match_all.png';

import { USER_IMAGE_DEFAULT } from '../../../../common/staticData';
import GameService from '../../../../services/game.service';
import GamePlayerStatErrorMessage from '../../games/tabs/players/status/errorMessage';
import { goalkeeper, statList } from '../../teams/tabs/players/status';
import { getPeriod } from '../../games/tabs/overview/tagListItem';
import { ActionData } from '../../components/common';
import TeamStatsVideoPlayer from '../../teams/tabs/stats/videoDialog';
import GameExportToEdits from '../../games/tabs/overview/exportEdits';

const LeadersPlayerStatDialog = ({ open, onClose, player, t }) => {
    const [playerState, setPlayerState] = useState(null);
    const [gameHalf, setGameHalf] = useState(['first', 'second']);
    const [gameTime, setGameTime] = useState(['1', '2', '3', '4', '5', '6']);
    const [loading, setLoading] = useState(false);
    const [courtArea, setCourtArea] = useState(['1', '2', '3', '4']);
    const [errorOpen, setErrorOpen] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [gamePlace, setGamePlace] = useState(null);
    const [playData, setPlayData] = useState([]);
    const [videoOpen, setVideoOpen] = useState(false);
    const [gameList, setGameList] = useState([]);
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

    const handleChangeCourtArea = (courtId) => {
        let newList = [...courtArea];

        if (newList.includes(courtId)) newList = newList.filter((item) => item !== courtId);
        else newList = [...newList, courtId];

        setCourtArea(newList);
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

    const handlePlayerStat = () => {
        if (gameTime.length === 0 || courtArea.length === 0) {
            setErrorOpen(true);

            return;
        }

        setLoading(true);

        if (player.player_position === 'Goalkeeper') {
            GameService.getGoalkeepersStatsAdvanceSummary({
                seasonId: player?.season_id ?? null,
                leagueId: null,
                gameId: null,
                teamId: player?.team_id ?? null,
                playerId: player?.player_id ?? null,
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
                seasonId: player?.season_id ?? null,
                leagueId: null,
                gameId: null,
                teamId: player?.team_id ?? null,
                playerId: player?.player_id ?? null,
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

    const handleDisplayVideo = async (cell) => {
        if (playerState && playerState[`total_${cell.id}`] > 0 && cell.action !== '') {
            let gameIds = [];

            await GameService.getAllGamesByCoach(player.season_id, null, player.team_id, null).then((res) => {
                setGameList(res.filter((item) => item.video_url.toLowerCase() !== 'no video'));
            });
            await GameService.getPlayersGames(player.season_id, player.team_id, player.player_id).then((res) => {
                gameIds = res.map((item) => item.game_id);
            });
            await GameService.getGamePlayerTags(
                currentUser.id,
                player.team_id,
                `${player.player_id}`,
                gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id,
                gameTime.length === 0 ? null : gameTime.join(','),
                courtArea.length === 0 ? null : courtArea.join(','),
                null,
                gameResult ? parseInt(gameResult) : null,
                gamePlace ? parseInt(gamePlace) : null
            ).then((res) => {
                let data = res;

                if (cell.title === 'Shots In The Box') data = res.filter((item) => item.inside_the_pain === true);
                else if (cell.title === 'Shots Out Of The Box' || cell.title === 'Exits') data = res.filter((item) => item.inside_the_pain === false);

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
                            team_id: player.team_id,
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

    const handleExportTags = (cell) => async (e) => {
        e.preventDefault();

        if (playerState && playerState[`total_${cell.id}`] > 0 && cell.action !== '') {
            let gameIds = [];

            await GameService.getPlayersGames(player.season_id, player.team_id, player.player_id).then((res) => {
                gameIds = res.map((item) => item.game_id);
            });
            await GameService.getGamePlayerTags(
                currentUser.id,
                player.team_id,
                `${player.player_id}`,
                gameIds.join(','),
                ActionData[cell.action].action_id,
                ActionData[cell.action].action_type_id,
                ActionData[cell.action].action_result_id,
                gameTime.length === 0 ? null : gameTime.join(','),
                courtArea.length === 0 ? null : courtArea.join(','),
                null,
                gameResult ? parseInt(gameResult) : null,
                gamePlace ? parseInt(gamePlace) : null
            ).then((res) => {
                let data = res;

                if (cell.title === 'Shots In The Box') data = res.filter((item) => item.inside_the_pain === true);
                else if (cell.title === 'Shots Out Of The Box' || cell.title === 'Exits') data = res.filter((item) => item.inside_the_pain === false);

                setPlayData(data);

                if (data.length > 0) setExportOpen(true);
            });
        }
    };

    const getStatList = () => {
        if (player) return player.player_position === 'Goalkeeper' ? goalkeeper : statList;

        return statList;
    };

    useEffect(() => {
        setPlayerState(player);
        setGameHalf(['first', 'second']);
        setGameTime(['1', '2', '3', '4', '5', '6']);
        setCourtArea(['1', '2', '3', '4']);
    }, [open]);

    useEffect(() => {
        if (player) {
            setLoading(true);

            if (player.player_position === 'Goalkeeper') {
                GameService.getGoalkeepersStatsAdvanceSummary({
                    seasonId: player?.season_id ?? null,
                    leagueId: null,
                    gameId: null,
                    teamId: player?.team_id ?? null,
                    playerId: player?.player_id ?? null,
                    gameTime: gameTime.length === 0 ? null : gameTime.join(','),
                    courtAreaId: courtArea.length === 0 ? null : courtArea.join(','),
                    insidePaint: null,
                    homeAway: gamePlace ? parseInt(gamePlace) : null,
                    gameResult: gameResult ? parseInt(gameResult) : null
                }).then((res) => {
                    setPlayerState(res[0]);
                    setLoading(false);
                });
            } else {
                GameService.getPlayersStatsAdvanced({
                    seasonId: player?.season_id ?? null,
                    leagueId: null,
                    gameId: null,
                    teamId: player?.team_id ?? null,
                    playerId: player?.player_id ?? null,
                    gameTime: gameTime.length === 0 ? null : gameTime.join(','),
                    courtAreaId: courtArea.length === 0 ? null : courtArea.join(','),
                    insidePaint: null,
                    homeAway: gamePlace ? parseInt(gamePlace) : null,
                    gameResult: gameResult ? parseInt(gameResult) : null
                }).then((res) => {
                    setPlayerState(res[0]);
                    setLoading(false);
                });
            }
        }
    }, [refresh, player]);

    console.log('leaders/stat => ', playerState);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="1500px">
            <DialogContent style={{ padding: '16px', display: 'flex', gap: '24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Box sx={{ border: '1px solid #E8E8E8', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', borderRadius: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{t('PROFILE')}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '460px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '120px', height: '120px' }}>
                                <img src={player?.image_url ? player?.image_url : USER_IMAGE_DEFAULT} style={{ borderRadius: '12px', height: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>{t('First name')}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>
                                        {player?.player_name ? player?.player_name.split(' ')[0] : ''}
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>{t('Last name')}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>
                                        {player?.player_name ? player?.player_name.split(' ')[1] : ''}
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>{t('Jersey Number')}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>
                                        {player?.player_jersey_number ?? ''}
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', flex: 1 }}>{t('Position')}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{player?.player_position ?? ''}</Typography>
                                </div>
                            </div>
                        </Box>
                    </Box>
                    <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{t('FILTERS')}</Typography>
                            <Button variant="outlined" color="success" sx={{ textTransform: 'none' }} onClick={() => handlePlayerStat()}>
                                {t('Recalculate')}
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{t('MATCH PERIOD')}</Typography>
                            <div style={{ width: '100%' }}>
                                <ToggleButtonGroup color="success" fullWidth size="small" value={gameHalf} onChange={handleChangeGameHalf}>
                                    <ToggleButton value="first">{t('1 HALF')}</ToggleButton>
                                    <ToggleButton value="second">{t('2 HALF')}</ToggleButton>
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
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{t('GAME RESULT')}</Typography>
                                    <ToggleButtonGroup exclusive color="success" fullWidth size="small" value={gameResult} onChange={handleChangeGameResult}>
                                        <ToggleButton value="1">{t('Won')}</ToggleButton>
                                        <ToggleButton value="2">{t('Draw')}</ToggleButton>
                                        <ToggleButton value="3">{t('Lose')}</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{t('GAME PLACE')}</Typography>
                                    <ToggleButtonGroup exclusive color="success" fullWidth size="small" value={gamePlace} onChange={handleChangeGamePlace}>
                                        <ToggleButton value="1">{t('Home')}</ToggleButton>
                                        <ToggleButton value="2">{t('Away')}</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{t('PLAYER STATS')}</Typography>
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
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{t(item.title)}</Typography>
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
                t={t}
                open={videoOpen}
                onClose={(flag) => {
                    setVideoOpen(false);

                    if (flag) setRefresh((r) => !r);
                }}
                video_url={gameList}
                tagList={playData}
            />
            <GameExportToEdits t={t} open={exportOpen} onClose={() => setExportOpen(false)} tagList={playData} isTeams={false} />
        </Dialog>
    );
};

export default LeadersPlayerStatDialog;
