import React, { useState, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Grid, TextField, Paper, Box, IconButton, Autocomplete, CircularProgress, Button } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';

import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service';

import { makeStyles } from '@mui/styles';

import GameTab from './Tabs/gameTab';
import MyEditsTab from './Tabs/myEditsTab';
import TeamStatsTab from './Tabs/TeamStatsTab';
import PlayerStatsTab from './Tabs/PlayerStatsTab';
import SettingsTab from './Tabs/SettingsTab';

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

const useStyles = makeStyles((theme) => ({
    '@global': {
        p: {
            color: 'black'
        }
    }
}));

export default function Coach() {
    const { t } = useTranslation();
    const classes = useStyles();

    const { user: currentUser } = useSelector((state) => state.auth);

    // const [curTab, setCurTab] = useState(!currentUser?.create_edits ? 0 : 3)
    const [curTab, setCurTab] = useState(2);

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamList: [],
        coachPlayerList: [],
        coachPlayer: null,
        team: null,
        playerList: [],
        playersInGameList: [],
        gameList: [],
        game: null,
        allTagList: [],
        opponentTagList: []
    });
    const { teamList, coachPlayerList, coachPlayer, team, gameList, game, allTagList, playerList, playersInGameList, opponentTagList } = state;

    const [drawOpen, setDrawOpen] = useState(true);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] });
            setLoading(false);
        });
        gameService.getAllMyCoachPlayer().then((res) => {
            setState({ coachPlayerList: res, coachPlayer: res[0] });
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        if (!team) return;
        setLoading(true);
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] });
            setDrawOpen(true);
            setLoading(false);
        });
    }, [team]);
    useEffect(() => {
        if (!!team && !!game) {
            setLoading(true);
            const opponentTeamId = game?.away_team_id === team.team_id ? game?.home_team_id : game?.away_team_id;
            gameService.getAllPlayerTagsByTeam(team.team_id, game?.id).then((res) => {
                setState({ allTagList: res });
                setLoading(false);
            });
            gameService.getAllPlayerTagsByTeam(opponentTeamId, game?.id).then((res) => {
                setState({ opponentTagList: res });
                setLoading(false);
            });
            gameService.getGameTeamPlayersByTeam(team.team_id, game?.id).then((res) => {
                setState({ playerList: res });
            });

            gameService.getAllGameTeamPlayers(game?.id).then((res) => {
                setState({
                    playersInGameList: res
                });
            });
        } else {
            setState({ allTagList: [] });
        }
    }, [team, game]);

    if (loading)
        return (
            <div style={styles.loader}>
                <CircularProgress />
            </div>
        );
    else
        return (
            <Box classes={classes['@global']} style={{ background: 'white', padding: '8px 8px 0' }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {[t('Games'), `${t('TeamStats')}`, `${t('PlayerStats')}`].map(
                            (title, idx) =>
                                !(idx === 3 && !currentUser?.create_edits) && (
                                    <Button fullWidth key={idx} style={{ height: '50px' }} variant={curTab === idx ? 'contained' : 'outlined'} onClick={() => setCurTab(idx)}>
                                        {title}
                                    </Button>
                                )
                        )}
                    </Grid>
                    {(curTab === 3 || curTab === 4) && (
                        <Grid item xs={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {[t('Settings')].map((title, idx) => (
                                <Button fullWidth key={idx} style={{ height: '50px' }} variant={curTab === 4 ? 'contained' : 'outlined'} onClick={() => setCurTab(4)}>
                                    {title}
                                </Button>
                            ))}
                        </Grid>
                    )}
                    <Grid item xs={6}>
                        {curTab !== 4 && curTab !== 3 && curTab !== 2 && (
                            <Autocomplete
                                options={teamList}
                                value={team}
                                fullWidth
                                isOptionEqualToValue={(option, value) => option && option.team_name}
                                disableClearable
                                getOptionLabel={(t) => `${t.season_name} - ${t.league_name} - ${t.team_name}`}
                                renderInput={(params) => <TextField {...params} label={t('Team')} />}
                                onChange={(event, newValue) => {
                                    setState({ team: newValue });
                                }}
                            />
                        )}
                        {curTab === 2 && (
                            <Autocomplete
                                options={coachPlayerList}
                                value={coachPlayer}
                                fullWidth
                                isOptionEqualToValue={(option, value) => option && option.name}
                                disableClearable
                                getOptionLabel={(t) => `${t.f_name} ${t.l_name}`}
                                renderInput={(params) => <TextField {...params} label={t('Player')} />}
                                onChange={(event, newValue) => {
                                    setState({ coachPlayer: newValue });
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
                {curTab === 0 && (
                    <Paper sx={{ m: 1 }}>
                        <Box sx={{ px: 1, display: drawOpen ? 'flex' : 'none', minHeight: 50, maxHeight: 350 }}>
                            {gameList.length === 0 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    No Game
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {gameList.map((g) => (
                                        <Grid item xs={6} md={2} key={g.id}>
                                            <Paper
                                                sx={{ m: 1 }}
                                                style={game !== g ? { opacity: 0.8 } : { border: '1px solid #1976d2' }}
                                                onClick={() => {
                                                    setState({ game: g });
                                                }}
                                            >
                                                <div className="gameImage" style={{ backgroundImage: `url(${g?.image?.length > 0 ? g.image : VIDEO_ICON})`, width: 100, height: 70 }}></div>
                                                <div>
                                                    <div>{moment(g.date).format('DD MMM, YYYY')}</div>
                                                    <div>{g.home_team_name}</div>
                                                    <div>{g.away_team_name}</div>
                                                </div>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                        <Box sx={{ textAlign: 'center', borderTop: '1px #80808038 solid', m: '0 10px' }}>
                            <IconButton onClick={() => setDrawOpen((v) => !v)} sx={{ background: '#8080804d' }}>
                                {drawOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                            </IconButton>
                        </Box>
                    </Paper>
                )}

                <Paper
                    className="coach-down-side"
                    style={{
                        paddingBottom: '0.5rem',
                        display: 'flex',
                        height:
                            curTab === 0
                                ? `calc(100vh - ${drawOpen ? (gameList?.length === 0 ? 230 : (gameList?.length / 4) * 50 + 250) : 180}px)`
                                : curTab === 3
                                ? `calc(100vh - ${drawOpen ? (gameList?.length === 0 ? 100 : (gameList?.length / 4) * 50 + 120) : 50}px)`
                                : ''
                    }}
                >
                    {curTab === 0 && (
                        <GameTab
                            allTagList={allTagList}
                            game={game}
                            playerList={playerList}
                            teamId={team?.team_id ?? 0}
                            opponentTagList={opponentTagList}
                            playersInGameList={playersInGameList}
                            t={t}
                        />
                    )}
                    {curTab === 1 && <TeamStatsTab gameList={gameList} team={team} t={t} />}
                    {curTab === 2 && <PlayerStatsTab player={coachPlayer} t={t} />}
                    {curTab === 3 && <SettingsTab frameSrc="http://soccersettings.scouting4u.com/" t={t} />}
                </Paper>
            </Box>
        );
}
