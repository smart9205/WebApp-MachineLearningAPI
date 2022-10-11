import React, { useEffect, useState, useContext } from 'react';
import { ProgressBar } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Snackbar, Alert, IconButton, CircularProgress } from '@mui/material';
import { manualFilterForTags, getPercent } from '../../../common/utilities';
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
export default function SkillTab({ playTags, onHighlight, showHighlight, t }) {
    const { context, setContext } = useContext(PlayerContext);

    const teamId = context.game.is_home_team ? context.game.home_team_id : context.game.away_team_id;
    const gameId = context.game.game_id;
    const playerId = context.player.id;

    const [skills, setSkills] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!teamId || !gameId || !playerId) return;
        GameService.getAllPlayerTagsByTeam(teamId, gameId)
            .then((res) => {
                setSkills(manualFilterForTags(res, playerId, t));
                setLoading(false);
            })
            .catch(() => setLoading(false));
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
                <div style={{ padding: 10 }}>
                    <div className="skilltab-action-header">
                        <div>
                            {showHighlight && (
                                <IconButton style={{ padding: 0 }} color="primary" className="skilltab-highlight-button" onClick={() => saveHighlight()}>
                                    <img src={StarButton} alt="icon" width={70} />
                                    {t('Create')} {t('Highlights')}
                                </IconButton>
                            )}
                        </div>
                        <div className="skilltab-action-header-player">
                            <p>{t('Player')}</p>
                        </div>
                        <p>{t('Team')}</p>
                    </div>
                    {skills.map((skill, i) => {
                        const percent =
                            skill.total / 2 < skill.success.length ? getPercent(skill.success.length, skill.total) : skill.total / 4 < skill.success.length ? 50 : skill.success.length > 0 ? 25 : 0;
                        return (
                            <div key={i} className="action-row">
                                <div className="skilltab-action-title">{skill.title}</div>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        !!skill.success.length && playTags(skill.success);
                                    }}
                                >
                                    <PlayCircleOutlineIcon />
                                </IconButton>
                                <div style={{ width: '100%', marginRight: 10 }}>
                                    <div>
                                        <ProgressBar
                                            height={20}
                                            filledBackground={`linear-gradient(to right,
                                                                ${skill.total / 4 > skill.success.length ? '#fefb72, #f0bb31' : '#98ffae, #00851e'})`}
                                            percent={percent}
                                            text={skill.success.length}
                                        />
                                    </div>
                                </div>
                                <div className="skilltab-total">
                                    <p>{skill.total}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
