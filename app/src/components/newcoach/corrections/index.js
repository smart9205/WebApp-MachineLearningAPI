import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Popover, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import PlayIcon from '@mui/icons-material/PlayArrowOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/CloseOutlined';

import GameService from '../../../services/game.service';
import CorrectionsVideoPlayer from './videoDialog';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import { UPDATE_CORRECTION_COUNT } from '../../../actions/types';

const Corrections = () => {
    const [corrections, setCorrections] = useState([]);
    const [playOpen, setPlayOpen] = useState(false);
    const [correctItem, setCorrectItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const handleDeny = () => {
        if (!correctItem) return;

        const newList = corrections.filter((data) => data.correction_id !== correctItem.correction_id);

        setMenuAnchorEl(null);
        setCorrections(newList);
        dispatch({ type: UPDATE_CORRECTION_COUNT, payload: newList.length });
        GameService.deleteCorrection(correctItem.correction_id);
    };

    const handleAccept = () => {
        if (!correctItem) return;

        const newList = corrections.filter((data) => data.correction_id !== correctItem.correction_id);

        setMenuAnchorEl(null);
        setCorrections(newList);
        dispatch({ type: UPDATE_CORRECTION_COUNT, payload: newList.length });
        GameService.doCorrection(correctItem.correction_id);
    };

    useEffect(() => {
        setLoading(true);
        GameService.getCorrectionRequest().then((res) => {
            setCorrections(res);
            setLoading(false);
        });
    }, []);

    console.log('correction => ', corrections);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Corrections</Typography>
                    </Box>
                    <Box sx={{ maxHeight: '80vh', overflowY: 'auto', width: '100%' }}>
                        {corrections.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    height: '120px',
                                    padding: '24px 16px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderRadius: '8px',
                                    background: 'white',
                                    border: '1px solid #E8E8E8',
                                    marginBottom: '8px'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px' }}>
                                        <img src={item.current_photo_url ? item.current_photo_url : PLAYER_ICON_DEFAULT} style={{ height: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{item.current_player_name}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}># {item.current_jersey_number}</Typography>
                                    </div>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>
                                        Asked to change {item.action_name} action to player{' '}
                                    </Typography>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px' }}>
                                        <img src={item.new_photo_url ? item.new_photo_url : PLAYER_ICON_DEFAULT} style={{ height: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{item.new_player_name}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}># {item.new_jersey_number}</Typography>
                                    </div>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                    <IconButton
                                        onClick={() => {
                                            setCorrectItem(item);
                                            setPlayOpen(true);
                                        }}
                                    >
                                        <PlayIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e) => {
                                            setCorrectItem(item);
                                            setMenuAnchorEl(e.currentTarget);
                                        }}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Popover
                        id={menuPopoverId}
                        open={menuPopoverOpen}
                        anchorEl={menuAnchorEl}
                        onClose={() => setMenuAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ '& .MuiPopover-paper': { borderRadius: '12px', border: '1px solid #E8E8E8' } }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
                            <Box sx={{ 'svg path': { fill: '#C5EAC6' }, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleAccept()}>
                                <CheckIcon />
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Accept</Typography>
                            </Box>
                            <Box sx={{ 'svg path': { fill: '#FFCCCB' }, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleDeny()}>
                                <CloseIcon />
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Deny</Typography>
                            </Box>
                        </Box>
                    </Popover>
                    {playOpen && (
                        <CorrectionsVideoPlayer
                            onClose={() => setPlayOpen(false)}
                            video_url={correctItem?.video_url ?? ''}
                            start={correctItem?.start_time ?? '00:00:00'}
                            end={correctItem?.end_time ?? '00:00:00'}
                            name=""
                        />
                    )}
                </>
            )}
        </Box>
    );
};

export default Corrections;
