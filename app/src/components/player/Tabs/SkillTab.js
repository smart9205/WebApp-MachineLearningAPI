import React, { useEffect, useState, useContext } from 'react';
import 'react-step-progress-bar/styles.css';
import { Snackbar, Alert, IconButton, CircularProgress, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import { PlayerContext } from '../index';

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
    { id: 'goal', title: 'Goals' },
    { id: 'shot', title: 'Shots' },
    { id: 'penalties', title: 'Penalties' },
    { id: 'penalties_missed', title: 'Penalties Missed' },
    { id: 'shot_on_target', title: 'Shots On Target' },
    { id: 'shot_off_target', title: 'Shots Off Target' },
    { id: 'dribble', title: 'Dribbles' },
    { id: 'dribble_successful', title: 'Successful Dribbles' },
    { id: 'crosses', title: 'Crosses' },
    { id: 'free_kick', title: 'Free Kicks' },
    { id: 'passes', title: 'Passes' },
    { id: 'successful_passes', title: 'Successful Passes' },
    { id: 'passes_for_shots', title: 'Passes For Shots' },
    { id: 'key_passes', title: 'Key Passes' },
    { id: 'through_passes', title: 'Through Passes' },
    { id: 'turnover', title: 'Turnovers' },
    { id: 'offside', title: 'Offsides' },
    { id: 'draw_fouls', title: 'Draw Fouls' },
    { id: 'tackle', title: 'Tackles' },
    { id: 'interception', title: 'Interceptions' },
    { id: 'saved', title: 'Saved' },
    { id: 'clearance', title: 'Clearance' },
    { id: 'fouls', title: 'Fouls' },
    { id: 'yellow_cards', title: 'Yellow Cards' },
    { id: 'red_cards', title: 'Red Cards' }
];

const ActionData = {
    goal: { action_id: '1', action_type_id: null, action_result_id: '3' },
    shot_on_target: { action_id: '1', action_type_id: null, action_result_id: '1' },
    shot_off_target: { action_id: '1', action_type_id: null, action_result_id: '2' },
    shot: { action_id: '1', action_type_id: null, action_result_id: null },
    free_kick: { action_id: '1,2,3', action_type_id: '11,13', action_result_id: null },
    passes: { action_id: '2', action_type_id: null, action_result_id: null },
    successful_passes: { action_id: '2', action_type_id: null, action_result_id: '4' },
    passes_for_shots: { action_id: '2', action_type_id: '15', action_result_id: null },
    key_passes: { action_id: '2', action_type_id: '7', action_result_id: null },
    through_passes: { action_id: '2', action_type_id: '6', action_result_id: null },
    crosses: { action_id: '3', action_type_id: '1,2,3,4,5,6,7,8,9,10,13,14,15', action_result_id: null },
    dribble: { action_id: '4', action_type_id: null, action_result_id: null },
    dribble_successful: { action_id: '4', action_type_id: null, action_result_id: '4' },
    offside: { action_id: '7', action_type_id: null, action_result_id: '15' },
    draw_fouls: { action_id: '6', action_type_id: null, action_result_id: null },
    turnover: { action_id: '2,7', action_type_id: null, action_result_id: '5,11,12,15' },
    saved: { action_id: '8', action_type_id: null, action_result_id: null },
    penalties: { action_id: '4', action_type_id: null, action_result_id: '14' },
    penalties_missed: { action_id: '1', action_type_id: '13', action_result_id: '2' },
    clearance: { action_id: '11', action_type_id: null, action_result_id: null },
    interception: { action_id: '10', action_type_id: null, action_result_id: null },
    tackle: { action_id: '12', action_type_id: null, action_result_id: null },
    fouls: { action_id: '5', action_type_id: null, action_result_id: null },
    yellow_cards: { action_id: null, action_type_id: '9', action_result_id: null },
    red_cards: { action_id: null, action_type_id: '10', action_result_id: null },
    Corner: { action_id: '2,3', action_type_id: '12', action_result_id: null },
    Blocked: { action_id: '13', action_type_id: null, action_result_id: '7,19' },
    All: { action_id: null, action_type_id: null, action_result_id: null }
};

export default function SkillTab({ playTags, onHighlight, showHighlight, t }) {
    const { context, setContext } = useContext(PlayerContext);

    const teamId = context.game.is_home_team ? context.game.home_team_id : context.game.away_team_id;
    const gameId = context.game.game_id;
    const playerId = context.player.id;

    const [playerStat, setPlayerStat] = useState(null);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const getNormalStatList = () => {
        return statList.filter((item) => playerStat && playerStat[`total_${item.id}`] > 0);
    };

    const getPlayerTags = (id) => {
        GameService.getGamePlayerTags(teamId, `${playerId}`, `${gameId}`, ActionData[id].action_id, ActionData[id].action_type_id, ActionData[id].action_result_id).then((res) => {
            console.log('######', res);
            playTags(
                res.map((item) => {
                    return {
                        start_time: item.player_tag_start_time,
                        end_time: item.player_tag_end_time,
                        player_fname: context.player.f_name,
                        player_lname: context.player.l_name,
                        jersey: context.player.jersey_number,
                        action_name: item.action_names,
                        player_id: item.player_id,
                        team_id: teamId
                    };
                })
            );
        });
    };

    useEffect(() => {
        if (!teamId || !gameId || !playerId) return;

        setLoading(true);
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
            gameResult: null,
            our: false
        }).then((res) => {
            setPlayerStat(res[0]);
            setLoading(false);
        });
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
                    {getNormalStatList().map((item) => (
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
                                cursor: 'pointer'
                            }}
                            onClick={() => getPlayerTags(item.id)}
                        >
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{item.title}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a1b1d' }}>{playerStat[`total_${item.id}`]}</Typography>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
