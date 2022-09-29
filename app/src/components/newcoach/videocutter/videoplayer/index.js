import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Slider, Select, MenuItem, Typography, Button } from '@mui/material';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import gameService from '../../../../services/game.service';
import GameImage from '../../../../assets/VideoCutter.png';
import { toHHMMSS } from '../../../../common/utilities';
import EditCreateClipDialog from './createClipDialog';
import EditConfirmMessage from './confirmMessage';
import { MenuProps } from '../../components/common';
import { useHotkeys } from 'react-hotkeys-hook';
// import VIDEO from '../../assets/1.mp4'

const styles = {
    action: {
        position: 'absolute',
        left: '3%',
        bottom: 10,
        zIndex: 100,
        color: 'white',
        fontSize: 14,
        display: 'flex',
        width: '50%'
    },
    buttonBox: {
        position: 'absolute',
        bottom: 5,
        left: 8,
        width: '88%'
    },
    button: {
        color: 'white',
        backgroundColor: '#80808069'
    }
};
export default function VCVideoPlayer({ saveEdit, drawOpen }) {
    const handle = useFullScreenHandle();
    const player = useRef(null);
    const [play, setPlay] = useState(false);
    const [ready, setReady] = useState(false);
    const [videoURL, setVideoURL] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [createOpen, setCreateOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [playRate, setPlayRate] = useState(1);
    const [newClip, setNewClip] = useState({
        start_time: '',
        end_time: '',
        edit_id: 0,
        sort: 0,
        game_id: 0,
        name: ''
    });
    const HOTKEY_OPTION = { enableOnContentEditable: true };

    const seekTo = (sec) => player.current && player.current.seekTo(sec);

    const fastVideo = (param) => {
        if (currentTime + param < 0) seekTo(0);
        else if (duration > 0 && currentTime + param >= duration) {
            seekTo(Math.floor(duration));
            setPlay(false);
        } else seekTo(currentTime + param);
    };

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]} / ${array[1]} / ${array[0]}`;
    };

    const handleSelectChange = async (e) => {
        const game = gameList.filter((item) => item.id === e.target.value)[0];

        setSelectedGame(game);

        if (game.video_url.startsWith('https://www.youtube.com')) {
            await gameService.getNewStreamURL(game.video_url).then((res) => {
                setVideoURL(res);
            });
        } else setVideoURL(game.video_url);

        setNewClip({ ...newClip, game_id: game.id });
        seekTo(0);
        setPlay(true);
    };

    const handleSetName = (name) => {
        setNewClip({ ...newClip, name: name });

        if (saveEdit === null || (saveEdit && saveEdit.type === 'folder')) setConfirmOpen(true);
    };

    const handleQS = () => {
        if (currentTime <= 15) setNewClip({ ...newClip, start_time: toHHMMSS(0), end_time: toHHMMSS(currentTime) });
        else setNewClip({ ...newClip, start_time: toHHMMSS(currentTime - 15), end_time: toHHMMSS(currentTime) });

        setPlay(false);
        setCreateOpen(true);
    };

    useHotkeys(
        'i',
        () => {
            if (saveEdit && saveEdit.type === 'edit') setNewClip({ ...newClip, start_time: toHHMMSS(currentTime) });
        },
        HOTKEY_OPTION
    );
    useHotkeys(
        'o',
        () => {
            if (saveEdit && saveEdit.type === 'edit') setNewClip({ ...newClip, end_time: toHHMMSS(currentTime) });
        },
        HOTKEY_OPTION
    );
    useHotkeys(
        'n',
        () => {
            if (saveEdit && saveEdit.type === 'edit') setPlayRate(1);
        },
        HOTKEY_OPTION
    );
    useHotkeys(
        'm',
        () => {
            if (saveEdit && saveEdit.type === 'edit') setPlayRate((s) => s + 0.5);
        },
        HOTKEY_OPTION
    );
    useHotkeys(
        'b',
        () => {
            if (saveEdit && saveEdit.type === 'edit') setPlayRate(0.5);
        },
        HOTKEY_OPTION
    );
    useHotkeys(
        'q',
        () => {
            if (saveEdit && saveEdit.type === 'edit') handleQS();
        },
        HOTKEY_OPTION
    );

    useEffect(async () => {
        let array = [];

        await gameService.getAllGamesByCoach(null, null, null, null).then((res) => {
            array = res.filter((game) => game.video_url.toLowerCase() !== 'no video');
        });
        await gameService.getAdditionalGames(null, null, null, null).then((res) => {
            const filt = res.filter((game) => game.video_url.toLowerCase() !== 'no video');

            array = [...array, ...filt];
            setGameList(array);
        });
    }, []);

    useEffect(async () => {
        if (selectedGame === null) {
            setVideoURL('');
            setPlay(false);
        }

        if (saveEdit && saveEdit.type === 'edit' && newClip.name !== '' && newClip.edit_id !== 0) {
            let bigSort = 0;

            await gameService.getBiggestSortNumber('Clip', saveEdit.id).then((res) => {
                bigSort = res['biggest_order_num'] === null ? 0 : res['biggest_order_num'];
            });
            await gameService.addNewEditClips({ id: saveEdit.id, rows: [newClip] }).then((res) => {
                setNewClip({ ...newClip, name: '', sort: bigSort + 1, edit_id: saveEdit.id });
                setPlay(true);
            });
        }
    }, [selectedGame, newClip, ready, saveEdit]);

    console.log('EditVideo => ', saveEdit, newClip);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '28px', width: '100%', marginLeft: '10%' }}>
            <Select
                value={selectedGame?.id ?? 0}
                onChange={handleSelectChange}
                label=""
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={MenuProps}
                disabled={gameList.length === 0}
                sx={{ outline: 'none', height: '36px', width: '50%', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
            >
                {gameList.map((game, index) => (
                    <MenuItem key={index} value={game.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#1a1b1d' }}>{`${game.home_team_name} VS ${game.away_team_name} - `}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: '#1a1b1d' }}>{getFormattedDate(game.date)}</Typography>
                        </div>
                    </MenuItem>
                ))}
            </Select>
            <div style={{ width: '100%', margin: 'auto', minWidth: 500, position: 'relative' }}>
                <FullScreen handle={handle}>
                    <div style={{ width: drawOpen ? '100%' : '90%' }}>
                        <div className="player-wrapper">
                            {videoURL !== '' && (
                                <ReactPlayer
                                    className="react-player"
                                    url={videoURL}
                                    // url={VIDEO}
                                    ref={player}
                                    onPlay={() => setPlay(true)}
                                    onPause={() => setPlay(false)}
                                    onReady={() => setReady(true)}
                                    onProgress={(p) => setCurrentTime(p.playedSeconds)}
                                    onDuration={(p) => setDuration(p)}
                                    playbackRate={playRate}
                                    playing={play}
                                    controls={false}
                                    width="100%"
                                    height="100%"
                                />
                            )}
                            {videoURL === '' && <img src={GameImage} style={{ width: '100%', height: '100%', borderRadius: '12px', position: 'absolute', left: 0, top: 0 }} />}
                        </div>
                    </div>

                    <div style={styles.buttonBox}>
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={position}
                            min={0}
                            step={1}
                            max={Math.floor(duration)}
                            onChange={(_, value) => {
                                setPosition(value);
                                seekTo(value);
                            }}
                            valueLabelFormat={(v) => toHHMMSS(v)}
                            valueLabelDisplay="auto"
                            sx={{
                                color: '#FFF',
                                height: 4,
                                '& .MuiSlider-thumb': {
                                    width: 8,
                                    height: 8,
                                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                    '&:before': {
                                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
                                    },
                                    '&:hover, &.Mui-focusVisible': {
                                        boxShadow: '0px 0px 0px 8px rgb(0 0 0 / 16%)'
                                    },
                                    '&.Mui-active': {
                                        width: 20,
                                        height: 20
                                    }
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.28
                                }
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '40px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: 'white' }}>{toHHMMSS(currentTime)}</Typography>
                            <IconButton
                                style={styles.button}
                                onClick={() => setNewClip({ ...newClip, start_time: toHHMMSS(currentTime) })}
                                disabled={saveEdit === null || (saveEdit && saveEdit.type === 'folder')}
                            >
                                <SpaceBarIcon color="white" sx={{ transform: 'rotate(90deg)' }} />
                            </IconButton>
                            <IconButton style={styles.button} onClick={() => fastVideo(-3)}>
                                <FastRewindIcon color="white" />
                            </IconButton>
                            <Button variant="outlined" sx={{ width: '60px', color: 'white' }} onClick={() => setPlayRate(0.5)}>
                                Slow
                            </Button>
                            <IconButton
                                onClick={() => {
                                    if (playRate === 1) setPlay((p) => !p);
                                    else setPlayRate(1);
                                }}
                                style={styles.button}
                            >
                                {play && playRate === 1 ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <Button variant="outlined" sx={{ width: '60px', color: 'white' }} onClick={() => setPlayRate((s) => s + 0.5)}>
                                Fast
                            </Button>
                            <IconButton style={styles.button} onClick={() => fastVideo(3)}>
                                <FastForwardIcon color="white" />
                            </IconButton>
                            <IconButton
                                style={styles.button}
                                disabled={saveEdit === null || (saveEdit && saveEdit.type === 'folder')}
                                onClick={() => {
                                    setNewClip({ ...newClip, end_time: toHHMMSS(currentTime) });
                                    setPlay(false);
                                    setCreateOpen(true);
                                }}
                            >
                                <SpaceBarIcon color="white" sx={{ transform: 'rotate(-90deg)' }} />
                            </IconButton>
                            <Button
                                variant="outlined"
                                disabled={saveEdit === null || (saveEdit && saveEdit.type === 'folder')}
                                sx={{ width: '50px', color: 'white', fontSize: '16px' }}
                                onClick={() => handleQS()}
                            >
                                QS
                            </Button>
                            <IconButton onClick={handle.active ? handle.exit : handle.enter} style={styles.button}>
                                {handle.active ? <FullscreenExitOutlinedIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </div>
                    </div>
                </FullScreen>
                <EditConfirmMessage open={confirmOpen} onClose={() => setConfirmOpen(false)} />
                <EditCreateClipDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleSetName} editNode={saveEdit} />
            </div>
        </div>
    );
}
