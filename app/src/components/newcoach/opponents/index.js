import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import GameListItem from './gameListItem';

const Opponents = () => {
    const [values, setValues] = useState({
        loading: false,
        gameList: [],
        hoverIndex: -1
    });

    useEffect(() => {
        setValues({ ...values, loading: true, gameList: [] });
        GameService.getAdditionalGames(null, null, null, null).then((res) => {
            setValues({ ...values, loading: false, gameList: res });
        });
    }, []);

    console.log('Opponents => ', values.gameList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Opponents</Typography>
            </Box>
            <Box sx={{ overflowY: 'auto', maxHeight: '80vh', marginLeft: '24px' }}>
                <Box sx={{ marginRight: '4px' }}>
                    {values.gameList.map((game, index) => (
                        <Box key={index} onMouseEnter={() => setValues({ ...values, hoverIndex: index })} onMouseLeave={() => setValues({ ...values, hoverIndex: -1 })}>
                            <GameListItem row={game} isHover={values.hoverIndex === index} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Opponents;
