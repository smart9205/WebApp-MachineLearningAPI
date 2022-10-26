import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import hotkeys from 'hotkeys-js';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';

import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ReactPlayer from 'react-player';
import GameService from '../../services/game.service';
import IndividualTagTable from './IndividualTagTable';
import TeamTagTable from './TeamTagTable';
import { Button, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toHHMMSS, toSecond, getUser, setUser, subSecToHHMMSS, addSecToHHMMSS } from '../../common/utilities';
import Shot from './contents/Shot';
import ShortPass from './contents/ShortPass';
import Pass from './contents/Pass';
import Cross from './contents/Cross';
import Foul from './contents/Foul';
import Dribble from './contents/Dribble';
import SelectMainPlayers from './contents/SelectMainPlayers';
import moment from 'moment';
import { compose } from '@mui/system';
import Others from './contents/Others';
import { getPeriod } from '../newcoach/games/tabs/overview/tagListItem';
const drawerWidth = '30%';

const PLAYBACK_RATE = [
    { rate: 0.3, label: 'x 0.3' },
    { rate: 0.5, label: 'x 0.5' },
    { rate: 1, label: 'x 1' },
    { rate: 1.5, label: 'x 1.5' },
    { rate: 2, label: 'x 2' },
    { rate: 2.5, label: 'x 2.5' },
    { rate: 3, label: 'x 3' }
];

const ControlButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
    color: ${(props) => props.color};
    margin: 4px;
    text-transform: none;
`;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    display: 'block',
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    })
}));

const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    p: 4
};
const TagButton = styled(({ color, ...otherProps }) => <Button {...otherProps} variant="outlined" />)`
    color: ${(props) => props.color};
    width: 100%;
`;
let ALL_ACTION_RESULTS = [];

const TAGGING = {
    short_pass: { id: 2, hotkey: 's', value: 'Short Pass' },
    pass: { id: 2, hotkey: 'w', value: 'Pass' },
    shot: { id: 1, hotkey: 'a', value: 'Shot' },
    cross: { id: 3, hotkey: 'c', value: 'Cross' },
    dribble: { id: 7, hotkey: 'q', value: 'Dribble' },
    foul: { id: 8, hotkey: 'e', value: 'Foul' }
};
const HOTKEY_OPTION = { enableOnContentEditable: true };

export default function Tagging() {
    const navigate = useNavigate();
    const { id } = useParams();
    const game_id = Number(atob(id).slice(3, -3));
    const { user: currentUser } = useSelector((state) => state.auth);

    React.useEffect(async () => {
        if (!currentUser) {
            navigate('/');
            window.alert('You must log in first.');

            return;
        }

        await GameService.getGame(game_id)
            .then((res) => {
                console.log(res);
                if (!((!res.done_tagging && currentUser.roles.includes('ROLE_TAGGER')) || currentUser.roles.includes('ROLE_ADMIN'))) {
                    navigate('/');
                    window.alert('Game has been already tagged');
                }
            })
            .catch((e) => {
                navigate('/');
            });
    }, [game_id]);

    const player = React.useRef(null);

    const seekTo = (sec) => player.current.seekTo(player.current.getCurrentTime() + sec);

    const [open, setOpen] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState('');

    const [count, setCount] = React.useState(0);
    const [teamTagList, setTeamTagList] = React.useState([]);
    const [playerTagList, setPlayerTagList] = React.useState([]);
    const [tagCnt, setTagCnt] = React.useState(0);
    const [temp_playerTag_list, setTempPlayerTagList] = React.useState([]);
    const [play, setPlay] = React.useState(false);
    const [playRate, setPlayRate] = React.useState(3);
    const [clicked, setClicked] = React.useState(false);
    const [curTeamTag, setCurTeamTag] = React.useState(null);
    const [curTagStatusText, setCurTagStatusText] = React.useState('');

    const [state, setState] = React.useReducer((old, action) => ({ ...old, ...action }), {
        url: '',
        offense: 'home',
        first_second: 'first',
        start_time: '00:00:00',
        home_team_name: '',
        away_team_name: '',
        homePlayers: [],
        awayPlayers: [],
        curTeamTagId: 0,
        game: []
    });

    const [config, setConfig] = React.useReducer((old, action) => ({ ...old, ...action }), {
        sec_before: 10,
        sec_after: 8
    });

    const [teamTag, setTeamTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
        id: 0,
        game_id,
        offensive_team_id: 0,
        defensive_team_id: 0,
        start_time: '00:00:00',
        end_time: '00:00:00',
        period: '1'
    });

    const [playerTag, setPlayerTag] = React.useReducer((old, action) => ({ ...old, ...action }), {
        team_tag_id: 0,
        team_id: 0,
        player_id: 0,
        action_id: 0,
        action_type_id: 1,
        action_result_id: 0,
        start_time: '00:00:00',
        end_time: '00:00:00'
    });

    const [gamePlayerRefresh, setGamePlayerRefresh] = React.useState(false);
    const [cpClicked, setCpclicked] = React.useState(false);

    const offenseTeam = state.offense === 'home' ? state.homePlayers : state.awayPlayers;
    const defenseTeam = state.offense === 'away' ? state.homePlayers : state.awayPlayers;

    const offenseTeamId = state.offense === 'home' ? state.home_team_id : state.away_team_id;
    const defenseTeamId = state.offense === 'away' ? state.home_team_id : state.away_team_id;

    React.useEffect(() => {
        GameService.getAllActionResults().then((res) => {
            ALL_ACTION_RESULTS = res;
        });
    }, []);

    React.useEffect(() => {
        GameService.getGame(game_id).then((res) => {
            setState({
                game: res,
                home_team_id: res.home_team_id,
                away_team_id: res.away_team_id,
                home_team_name: res.home_team_name,
                away_team_name: res.away_team_name
            });
            if (res.video_url.startsWith('https://www.youtube.com')) {
                GameService.getNewStreamURL(res.video_url).then((res) => {
                    setState({ url: res.url });
                });
            } else {
                setState({ url: res.video_url });
            }
        });
    }, [game_id]);

    const GameTeamPlayer = async () => {
        await GameService.getGameTeamPlayers({ game_id }).then((res) => {
            setState({
                homePlayers: res.home_team.map((p) => {
                    return { ...p, checked: true };
                }),
                awayPlayers: res.away_team.map((p) => {
                    return { ...p, checked: true };
                })
            });
        });
    };

    React.useEffect(() => {
        GameTeamPlayer();
    }, [count, game_id]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            GameTeamPlayer();
        }, 2000);
        return () => {
            clearTimeout(timer);
            setGamePlayerRefresh(false);
        };
    }, [gamePlayerRefresh]);

    const updateTagList = () => setTagCnt(tagCnt + 1);
    const handleDrawerOpen = () => setOpen(!open);

    React.useEffect(() => {
        if (game_id <= 0) return;

        GameService.getAllTeamTagsByGame(game_id).then((res) => {
            setTeamTagList(res);
            if (!res.length) {
                setPlayerTagList([]);
                return;
            }
            setState({ curTeamTagId: res[0].id });
            dispPlayerTags(res[0].id);
        });
    }, [game_id, tagCnt]);

    const dispPlayerTags = (id) => {
        if (!id) return;
        setState({ curTeamTagId: id });

        GameService.getAllPlayerTagsByTeamTag(id)
            .then((res) => {
                setPlayerTagList(res);
            })
            .catch(() => {});
    };

    const changePlayRate = (flag) => {
        let newRate = flag ? playRate + 1 : playRate - 1;
        if (newRate < 0) newRate = 0;
        if (newRate > PLAYBACK_RATE.length - 1) newRate = PLAYBACK_RATE.length - 1;
        setPlayRate(newRate);
        setPlay(true);
    };

    React.useEffect(() => {
        setTeamTag({
            game_id,
            start_time: state.start_time,
            offensive_team_id: offenseTeamId,
            defensive_team_id: defenseTeamId
        });
    }, [offenseTeamId, defenseTeamId, state.start_time, game_id]);

    let i = 0;
    document.addEventListener('keydown', function (event) {
        if (i <= 1) {
            if (event.key === 'm') {
                changePlayRate(true);
                i++;
            }
            if (event.key === 'b') {
                changePlayRate(false);
                i++;
            }
        }
        return;
    });

    useHotkeys('h', () => seekTo(-1), HOTKEY_OPTION);
    useHotkeys('g', () => seekTo(-3), HOTKEY_OPTION);
    useHotkeys('shift+g', () => seekTo(-5), HOTKEY_OPTION);
    useHotkeys('alt+g', () => seekTo(-10), HOTKEY_OPTION);

    useHotkeys('j', () => seekTo(1), HOTKEY_OPTION);
    useHotkeys('k', () => seekTo(3), HOTKEY_OPTION);
    useHotkeys('shift+k', () => seekTo(5), HOTKEY_OPTION);
    useHotkeys('alt+k', () => seekTo(10), HOTKEY_OPTION);

    useHotkeys('esc', () => setModalOpen(false), HOTKEY_OPTION);

    useHotkeys('up', () => offensiveTeamClicked('home'), HOTKEY_OPTION);
    useHotkeys('down', () => offensiveTeamClicked('away'), HOTKEY_OPTION);

    useHotkeys(TAGGING.short_pass.hotkey, () => taggingButtonClicked(TAGGING.short_pass.value), HOTKEY_OPTION);
    useHotkeys(TAGGING.pass.hotkey, () => taggingButtonClicked(TAGGING.pass.value), HOTKEY_OPTION);
    useHotkeys(TAGGING.shot.hotkey, () => taggingButtonClicked(TAGGING.shot.value), HOTKEY_OPTION);
    useHotkeys(TAGGING.dribble.hotkey, () => taggingButtonClicked(TAGGING.dribble.value), HOTKEY_OPTION);
    useHotkeys(TAGGING.foul.hotkey, () => taggingButtonClicked(TAGGING.foul.value));
    useHotkeys(TAGGING.cross.hotkey, () => taggingButtonClicked(TAGGING.cross.value), HOTKEY_OPTION);
    useHotkeys('x', () => taggingButtonClicked('Others'), HOTKEY_OPTION);
    useHotkeys('v', () => setClicked(true), HOTKEY_OPTION);

    useHotkeys('return', () => setPlay((v) => !v), HOTKEY_OPTION);
    useHotkeys('n', () => setPlay((v) => !v), HOTKEY_OPTION);

    const taggingButtonClicked = (action) => {
        setModalOpen(true);
        setModalContent(action);

        setPlay(false);

        const curTime = player.current.getCurrentTime();
        setTeamTag({ end_time: toHHMMSS(`${curTime + config.sec_after}`) });
        setPlayerTag({
            team_id: offenseTeamId,
            action_id: action.id,
            start_time: toHHMMSS(`${curTime - config.sec_before}`),
            end_time: toHHMMSS(`${curTime + config.sec_after}`)
        });
    };

    const addTeamTag = async (isCP) => {
       
        try {
            const res = await GameService.addTeamTag({
                ...teamTag,
                
                end_time: isCP ? toHHMMSS(player.current.getCurrentTime()) : teamTag.end_time
            });
            setModalOpen(false);
            setTeamTag({ id: res.id });
            setTagCnt(tagCnt + 1);
            return res;
        } catch (e) {}
    };

    const addPlayerTag = async (PTag) => await GameService.addPlayerTag(PTag);

    const setTaggingState = (tags) => {
        setTempPlayerTagList([
            ...temp_playerTag_list,
            ...tags.map((tag) => {
                return {
                    ...tag,
                    start_time: playerTag.start_time,
                    end_time: playerTag.end_time
                };
            })
        ]);
    };

    React.useEffect(() => {
        GameService.updateTaggerConfig(config).then((res) => {
            setUser({
                ...getUser(),
                user_config: {
                    sec_before: config.sec_before,
                    sec_after: config.sec_after
                }
            });
        });
    }, [config]);

    const saveTags = async (isCP = false) => {
        setPlay(false);
        const tTag = await addTeamTag(isCP);
        for (const pTag of temp_playerTag_list) {
            await addPlayerTag({ ...pTag, team_tag_id: tTag.id });
        }
        setTempPlayerTagList([]);
        
        dispPlayerTags(tTag.id);
    };

    React.useEffect(() => {
        const last = temp_playerTag_list.slice(-1)[0];

        if (ALL_ACTION_RESULTS.find((f) => f.id === last?.action_result_id)?.end_possession) {
            if (temp_playerTag_list.find((t) => ALL_ACTION_RESULTS.find((f) => f.id === t?.action_result_id)?.change_possession)) {
                setTeamTag({ start_time: teamTag.start_time });
            }
        }

        if (cpClicked) {
            setPlay(false);
        } else {
            setPlay(true);
        }
        setModalOpen(false);
    }, [temp_playerTag_list]);

    React.useEffect(() => {
        if (clicked) {
            setCpclicked(true);
            saveTags(true);
            setClicked(false);
        }
    }, [clicked]);

    const offensiveTeamClicked = (team) => {
        const st = toHHMMSS(`${player.current.getCurrentTime() ? player.current.getCurrentTime() : 0}`);
        setState({ offense: team, start_time: subSecToHHMMSS(st, 5) });
    };

    const displayTagInfo = () => {
        if (curTeamTag === null) return '';
        if (player && player.current.getCurrentTime() < toSecond(teamTagList[teamTagList.length - 1].start_time)) return '';

        const period = getPeriod(curTeamTag.period);
        let time = Math.floor(player.current.getCurrentTime()) - toSecond(teamTagList[teamTagList.length - 1].start_time);

        if (curTeamTag.period === 2) time -= 45 * 60;
        else if (curTeamTag.period === 3) time -= 90 * 60;

        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        if (minutes < 0) minutes = '0';
        else if (minutes < 10) minutes = '0' + minutes;

        if (seconds < 0) seconds = '0';
        else if (seconds < 10) seconds = '0' + seconds;

        console.log('#########', period, minutes, seconds);
        return `${period} ${minutes}:${seconds}`;
    };

    React.useEffect(() => {
        setCurTagStatusText(displayTagInfo());
    }, [state.curTeamTagId]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Modal disableAutoFocus open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box style={style}>
                    {modalContent === TAGGING.shot.value && (
                        <Shot offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} />
                    )}
                    {modalContent === TAGGING.short_pass.value && <ShortPass offenseTeam={offenseTeam} taggingState={setTaggingState} offenseTeamId={offenseTeamId} />}
                    {modalContent === TAGGING.pass.value && (
                        <Pass offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} />
                    )}
                    {modalContent === TAGGING.cross.value && (
                        <Cross offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} />
                    )}
                    {modalContent === TAGGING.foul.value && (
                        <Foul offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} />
                    )}
                    {modalContent === TAGGING.dribble.value && (
                        <Dribble offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} />
                    )}
                    {modalContent === 'Others' && (
                        <Others offenseTeamId={offenseTeamId} defenseTeamId={defenseTeamId} offenseTeam={offenseTeam} defenseTeam={defenseTeam} taggingState={setTaggingState} />
                    )}
                    {modalContent === 'SELECT_PLAYER' && <SelectMainPlayers homeTeam={state.homePlayers} awayTeam={state.awayPlayers} game={state.game} setGamePlayerRefresh={setGamePlayerRefresh} />}
                </Box>
            </Modal>
            <CssBaseline />
            <Drawer
                sx={{
                    width: '33%',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '33%',
                        boxSizing: 'border-box'
                    }
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <TeamTagTable
                    rows={teamTagList}
                    sx={{ height: '60%', p: 1, width: '100%' }}
                    updateTagList={updateTagList}
                    handleRowClick={(row) => {
                        setCurTeamTag(row);
                        player.current.seekTo(toSecond(row?.start_time));
                        dispPlayerTags(row?.id);
                       
                    }}
                    selectedId={state.curTeamTagId}
                />
                <IndividualTagTable
                    sx={{ height: '40%', p: 1, width: '100%' }}
                    rows={playerTagList}
                    offenseTeamId={offenseTeamId}
                    offenseTeam={offenseTeam}
                    defenseTeam={defenseTeam}
                    updateTagList={() => {
                        dispPlayerTags(state.curTeamTagId);
                    }}
                />
            </Drawer>

            <Main open={open}>
                <div style={{ width: 30 }}>
                    <Tooltip title={`${open ? 'Close' : 'Open'} Tags`}>
                        <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ height: 50, width: 50, position: 'fixed', zIndex: 1300, top: '45%' }}>
                            {open ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                        </IconButton>
                    </Tooltip>
                </div>
                <Box>
                    <div style={{ maxWidth: '92%', margin: 'auto', position: 'relative' }}>
                        <div className="player-wrapper">
                            <ReactPlayer
                                className="react-player"
                                url={state.url}
                                /* url={VIDEO} */
                                ref={player}
                                onPlay={() => setPlay(true)}
                                onPause={() => setPlay(false)}
                                onProgress={(p) => setCurTagStatusText(displayTagInfo())}
                                playing={play}
                                playbackRate={PLAYBACK_RATE[playRate].rate}
                                controls={true}
                                width="100%"
                                height="97%"
                            />
                        </div>
                        {curTagStatusText !== '' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', top: '10px' }}>
                                <div style={{ background: 'blue', width: 'fit-content', padding: '4px 8px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 500, color: 'white' }}>{curTagStatusText}</Typography>
                                </div>
                            </div>
                        )}
                    </div>
                    {open && (
                        <>
                            <Box sx={{ flexGrow: 1, textAlign: 'center', marginTop: '-20px' }}>
                                <IconButton
                                    sx={{ my: 1 }}
                                    onClick={() => {
                                        setCount(count + 1);
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                                {[-10, -5, -3, -1].map((t) => (
                                    <ControlButton
                                        key={t}
                                        onClick={() => {
                                            seekTo(t);
                                        }}
                                    >
                                        {t}s
                                    </ControlButton>
                                ))}

                                <ControlButton onClick={() => changePlayRate(false)}>slow</ControlButton>

                                {play ? (
                                    <ControlButton style={{ width: 100 }} startIcon={<PauseCircleOutlineIcon />} onClick={() => setPlay(false)}>
                                        Pause
                                    </ControlButton>
                                ) : (
                                    <ControlButton
                                        style={{ width: 100 }}
                                        startIcon={<PlayCircleOutlineIcon />}
                                        onClick={() => {
                                            setPlay(true);
                                            setCpclicked(false);
                                        }}
                                    >
                                        Play
                                    </ControlButton>
                                )}

                                <label style={{ width: '40px' }}>{PLAYBACK_RATE[playRate].label}</label>

                                <ControlButton onClick={() => changePlayRate(true)}>fast</ControlButton>

                                {[1, 3, 5, 10].map((t) => (
                                    <ControlButton key={t} onClick={() => seekTo(t)}>
                                        {t}s
                                    </ControlButton>
                                ))}
                            </Box>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ mx: 1, textAlign: 'center' }}>
                                    <TextField
                                        label="sec. before"
                                        sx={{ m: 1, width: 90 }}
                                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                        type="number"
                                        value={config.sec_before}
                                        onChange={(e) => setConfig({ sec_before: e.target.value })}
                                    />
                                    <TextField
                                        label="sec. after"
                                        sx={{ m: 1, width: 90 }}
                                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                        type="number"
                                        value={config.sec_after}
                                        onChange={(e) => setConfig({ sec_after: e.target.value })}
                                    />
                                    <div>
                                        <Button variant="outlined" onClick={() => taggingButtonClicked('SELECT_PLAYER')}>
                                            Select Players
                                        </Button>
                                    </div>
                                </Box>
                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                    {['home', 'away'].map((t) => (
                                        <ControlButton
                                            key={t}
                                            fullWidth
                                            style={{ backgroundColor: t === state.offense && 'darkblue', color: t === state.offense && 'white' }}
                                            onClick={() => {
                                                offensiveTeamClicked(t);
                                                setPlay(true);
                                                setCpclicked(false);
                                            }}
                                        >
                                            {state[`${t}_team_name`]}
                                        </ControlButton>
                                    ))}
                                    <Box style={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginLeft: 20 }}>
                                        Start Time : {state.start_time}
                                        <ControlButton
                                            sx={{ mr: 0 }}
                                            onClick={() => {
                                                saveTags(true);
                                                setCpclicked(true);
                                            }}
                                        >
                                            C.P. (v)
                                        </ControlButton>
                                    </Box>
                                </Box>

                                <Grid container spacing={0.5} sx={{ textAlign: 'center', mt: 1, mx: 2, maxWidth: 220 }}>
                                    {Object.keys(TAGGING).map((key, i) => (
                                        <Grid key={i} item xs={6} onClick={() => taggingButtonClicked(TAGGING[key].value)}>
                                            <TagButton style={{ textTransform: 'none', fontSize: '10px' }}>
                                                {TAGGING[key].value} ({TAGGING[key].hotkey})
                                            </TagButton>
                                        </Grid>
                                    ))}
                                </Grid>
                                <TagButton
                                    onClick={(e) => taggingButtonClicked('Others')}
                                    style={{ textTransform: 'none', fontSize: '10px', writingMode: 'vertical-rl', maxWidth: 10, height: 125, marginTop: '12px' }}
                                >
                                    Others (x)
                                </TagButton>

                                <RadioGroup
                                    sx={{ my: 0, mx: 2 }}
                                    aria-label="firstsecond"
                                    name="row-radio-buttons-group"
                                    value={teamTag.period}
                                    onChange={(e) => setTeamTag({ period: e.target.value })}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="1st half" />
                                    <FormControlLabel value="2" control={<Radio />} label="2nd half" />
                                    <FormControlLabel value="3" control={<Radio />} label="Overtime" />
                                </RadioGroup>
                            </div>
                        </>
                    )}
                </Box>
            </Main>
        </Box>
    );
}
