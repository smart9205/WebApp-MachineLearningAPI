import React, { useState } from 'react';
import { Box, Checkbox, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

const EditGameSelectDialog = ({ open, onClose, gameList, setGame }) => {
    const [selected, setSelected] = useState(0);

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]}/${array[1]}/${array[0]}`;
    };

    const handleCloseDialog = () => {
        const ids = gameList.filter((game) => game.id === selected)[0];

        onClose();
        setGame(ids);
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Select Game</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh', width: '600px', overflowY: 'auto' }}>
                {gameList.map((game, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', borderBottom: index < gameList.length - 1 ? '1px solid #E8E8E8' : 'none' }}>
                        <Checkbox checked={game.id === selected} onChange={() => setSelected(game.id)} />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>
                            {`${game.home_team_name}  VS  ${game.away_team_name} - `}
                        </Typography>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{`${getFormattedDate(game.date)}`}</Typography>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default EditGameSelectDialog;
