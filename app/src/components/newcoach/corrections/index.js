import React, { useEffect, useState } from 'react';
import { Box, fabClasses, IconButton, Typography } from '@mui/material';

import PlayIcon from '@mui/icons-material/PlayArrowOutlined';
import CheckIcon from '@mui/icons-material/Check';

import GameService from '../../../services/game.service';
import CorrectionsVideoPlayer from './videoDialog';

const Corrections = () => {
    const [corrections, setCorrections] = useState([]);
    const [playOpen, setPlayOpen] = useState(false);
    const [correctItem, setCorrectItem] = useState(null);

    useEffect(() => {
        GameService.getCorrectionRequest().then((res) => {
            setCorrections(res);
        });
    }, []);

    console.log('correction => ', corrections);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Corrections</Typography>
            </Box>
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto', width: '100%' }}>
                {corrections.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: '100px',
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
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{item.current_player_name}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>
                                Asked to change {item.action_name} action to player{' '}
                            </Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{item.new_player_name}</Typography>
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
                            <IconButton>
                                <CheckIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>
            {playOpen && (
                <CorrectionsVideoPlayer
                    onClose={() => setPlayOpen(false)}
                    video_url={correctItem?.video_url ?? ''}
                    start={correctItem?.start_time ?? '00:00:00'}
                    end={correctItem?.end_time ?? '00:00:00'}
                />
            )}
        </Box>
    );
};

export default Corrections;
