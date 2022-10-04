import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';

import PlayIcon from '@mui/icons-material/PlayArrowOutlined';

import GameService from '../../../services/game.service';

const Corrections = () => {
    const [corrections, setCorrections] = useState([]);

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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{item.current_player_name}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>Asked to change {item.action_name}</Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d', flex: 1 }}>{item.new_player_name}</Typography>
                        <IconButton sx={{ flex: 1 }}>
                            <PlayIcon />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Corrections;
