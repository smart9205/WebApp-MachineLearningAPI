import React, { useEffect, useState, useContext } from 'react';
import 'react-step-progress-bar/styles.css';
import { Snackbar, Alert, IconButton, CircularProgress, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';
import { ActionData } from '../../newcoach/components/common';

import StarButton from '../../../assets/Stars.png';

const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export const statList = [
    { id: 'goal', title: 'Goals', action: 'Goal' },
    { id: 'shot', title: 'Shots', action: 'GoalKick' },
    { id: 'penalties', title: 'Penalties', action: 'Penalty' },
    { id: 'penalties_missed', title: 'Penalties Missed', action: 'PenaltyMissed' },
    { id: 'shot_on_target', title: 'Shots On Target', action: 'GoalOpportunity' },
    { id: 'shot_off_target', title: 'Shots Off Target', action: 'ShotOffTarget' },
    { id: 'dribble', title: 'Dribbles', action: 'Dribble' },
    { id: 'dribble_successful', title: 'Successful Dribbles', action: 'DribbleSuccess' },
    { id: 'crosses', title: 'Crosses', action: 'Cross' },
    { id: 'free_kick', title: 'Free Kicks', action: 'FreeKick' },
    { id: 'passes', title: 'Passes', action: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes', action: 'PassesSuccess' },
    { id: 'passes_for_shots', title: 'Passes For Shots', action: 'PassesShots' },
    { id: 'key_passes', title: 'Key Passes', action: 'KeyPass' },
    { id: 'through_passes', title: 'Through Passes', action: 'ThroughPass' },
    { id: 'turnover', title: 'Turnovers', action: 'Turnover' },
    { id: 'offside', title: 'Offsides', action: 'Offside' },
    { id: 'corner', title: 'Corners', action: 'Corner' },
    { id: 'draw_fouls', title: 'Draw Fouls', action: 'DrawFoul' },
    { id: 'tackle', title: 'Tackles', action: 'Tackle' },
    { id: 'interception', title: 'Interceptions', action: 'Interception' },
    { id: 'saved', title: 'Saved', action: 'Saved' },
    { id: 'clearance', title: 'Clearance', action: 'Clearance' },
    { id: 'fouls', title: 'Fouls', action: 'Foul' },
    { id: 'yellow_cards', title: 'Yellow Cards', action: 'YellowCard' },
    { id: 'red_cards', title: 'Red Cards', action: 'RedCard' }
];

export const goalkeeper = [
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
    { id: 'yellow_cards', title: 'Yellow Cards', action: 'YellowCard' }
];

export default function SkillTab({ playTags, onHighlight, showHighlight, t }) {
    const { context, setContext } = useContext(PlayerContext);

    const teamId = context.game.is_home_team ? context.game.home_team_id : context.game.away_team_id;
    const gameId = context.game.game_id;
    const playerId = context.player.id;
    const pos_name = context.player.position_name;

    const [playerStat, setPlayerStat] = useState(null);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const getPlayerTags = (cell) => {
        GameService.getGamePlayerTags(
            null,
            teamId,
            `${playerId}`,
            `${gameId}`,
            ActionData[cell.action].action_id,
            ActionData[cell.action].action_type_id,
            ActionData[cell.action].action_result_id,
            null,
            null,
            null
        ).then((res) => {
            const flist = cell.title === 'Exits' ? res.filter((item) => item.inside_the_pain === false) : res;

            console.log('skill tab => ', res);
            playTags(
                flist.map((item) => {
                    return {
                        start_time: item.player_tag_start_time,
                        end_time: item.player_tag_end_time,
                        player_fname: context.player.f_name,
                        player_lname: context.player.l_name,
                        jersey: context.player.jersey_number,
                        action_name: item.action_names,
                        player_id: item.player_id,
                        team_id: teamId,
                        id: item.id
                    };
                })
            );
        });
    };

    const getStatList = () => {
        return pos_name ? (pos_name === 'Goalkeeper' ? goalkeeper : statList) : statList;
    };

    useEffect(() => {
        if (!teamId || !gameId || !playerId) return;

        setLoading(true);

        if (pos_name === 'Goalkeeper') {
            GameService.getGoalkeepersStatsAdvanceSummary({
                seasonId: context.game?.season_id ?? null,
                leagueId: context.game?.league_id ?? null,
                gameId: gameId ?? null,
                teamId: teamId ?? null,
                playerId: playerId ?? null,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null
            }).then((res) => {
                setPlayerStat(res[0]);
                setLoading(false);
            });
        } else {
            GameService.getPlayersStatsAdvanced({
                seasonId: context.game?.season_id ?? null,
                leagueId: context.game?.league_id ?? null,
                gameId: gameId ?? null,
                teamId: teamId ?? null,
                playerId: playerId ?? null,
                gameTime: null,
                courtAreaId: null,
                insidePaint: null,
                homeAway: null,
                gameResult: null
            }).then((res) => {
                setPlayerStat(res[0]);
                setLoading(false);
            });
        }
    }, [teamId, gameId, playerId]);

    const saveHighlight = () => {
        setLoading(true);
        GameService.addHighlight({
            player_id: playerId,
            game_id: gameId
        })
            .then((res) => {
                setOpen(true);
                setMsg(res.msg);
                setLoading(false);
                setContext({ update_cnt: context.update_cnt + 1 });
                onHighlight();
            })
            .catch(() => setLoading(false));
    };

    return (
        <>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="warning" sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            {loading ? (
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
                    <div className="skilltab-action-header">
                        <div>
                            {showHighlight && (
                                <IconButton style={{ padding: 0 }} color="primary" className="skilltab-highlight-button" onClick={() => saveHighlight()}>
                                    <img src={StarButton} alt="icon" width={70} />
                                    {t('Create')} {t('Highlights')}
                                </IconButton>
                            )}
                        </div>
                    </div>
                    {getStatList().map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '4px',
                                padding: '6px 0',
                                width: '100%',
                                height: '60px',
                                borderRadius: '12px',
                                border: '1px solid #E8E8E8',
                                background: context.player?.second_color ?? 'white',
                                cursor: 'pointer',
                                direction: 'ltr'
                            }}
                            onClick={() => getPlayerTags(item)}
                        >
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{playerStat[`total_${item.id}`] ?? '0'}</Typography>
                        </div>
                    ))}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '6px 0',
                            width: '100%',
                            height: '60px',
                            borderRadius: '12px',
                            border: '1px solid #E8E8E8',
                            background: context.player?.second_color ?? 'white',
                            cursor: 'pointer',
                            direction: 'ltr'
                        }}
                        onClick={() => getPlayerTags({ action: 'All', title: '' })}
                    >
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>All Actions</Typography>
                    </div>
                </div>
            )}
        </>
    );
}
