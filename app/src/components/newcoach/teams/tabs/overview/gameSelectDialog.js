import { Box, Checkbox, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const TeamGameSelectDialog = ({ open, onClose, gameList, setIds }) => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkGames, setCheckGames] = useState([]);

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]}/${array[1]}/${array[0]}`;
    };

    const handleCloseDialog = () => {
        const ids = gameList.filter((game, index) => checkGames[index] === true).map((item) => item.id);

        console.log('TeamGame => ', ids);
        onClose();
        setIds(ids);
    };

    useEffect(() => {
        let array = [];

        for (let i = 0; i < gameList.length; i++) array = [...array, selectAll];

        setCheckGames(array);
    }, [selectAll, gameList]);

    return (
        <Dialog open={open} onClose={handleCloseDialog} width="550px">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Select All</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '30vh', overflowY: 'auto' }}>
                {gameList.map((game, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox checked={checkGames[index]} onChange={(e) => setCheckGames({ ...checkGames, [index]: e.target.checked })} />
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

export default TeamGameSelectDialog;
