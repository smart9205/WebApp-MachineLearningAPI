import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Popover, Typography } from '@mui/material';

import { SaveButton } from '../../components/common';
import GameOverview from '../../games/tabs/overview';

const TeamOverview = ({ games }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuPopoverOpen = Boolean(menuAnchorEl);
    const menuPopoverId = menuPopoverOpen ? 'simple-popover' : undefined;

    const [gameIds, setGameIds] = useState([]);
    const [checkGames, setCheckGames] = useState([]);

    const handleShowPopover = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]}/${array[1]}/${array[0]}`;
    };

    const getItemText = (item) => {
        return item.home_team_name.concat(' VS ', item.away_team_name);
    };

    useEffect(() => {
        if (games.length > 0) {
            let array = [];

            for (let i = 0; i < games.length; i += 1) array = [...array, false];

            setCheckGames(array);
        }
    }, [games]);

    return (
        <Box sx={{ maxHeight: '80vh', minHeight: '70vh', overflowY: 'auto' }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <SaveButton sx={{ fontSize: '16px', width: '300px', height: '36px' }} onClick={handleShowPopover}>
                    Select Games From List
                </SaveButton>
            </Box>
            <Popover
                id={menuPopoverId}
                open={menuPopoverOpen}
                anchorEl={menuAnchorEl}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ '& .MuiPopover-paper': { width: '400px', borderRadius: '12px 0 0 12px', border: '1px solid #E8E8E8', maxHeight: '300px', overflowY: 'auto' } }}
            >
                {games.map((game, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: '4px 12px' }}>
                        <Checkbox value={checkGames[index]} checked={checkGames[index] ? true : false} onChange={(e) => setCheckGames({ ...checkGames, [index]: e.target.checked })} />
                        <Box>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{getItemText(game)}</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>
                                {`${getFormattedDate(game.date)} - ${game.league_name} - ${game.season_name}`}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Popover>
            {games.length > 0 && <GameOverview game={games[0]} hasPadding={false} isSub={true} />}
        </Box>
    );
};

export default TeamOverview;
