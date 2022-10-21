import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import '../../../coach_style.css';

const TeamGameSelectDialog = ({ open, onClose, gameList, setIds }) => {
    const selectedRef = useRef();
    const [selectAll, setSelectAll] = useState(false);
    const [selectedGames, setSelectedGames] = useState([]);

    selectedRef.current = selectedGames;

    const handleCloseDialog = () => {
        setIds(selectedRef.current);
        onClose();
    };

    const handleRowSelection = (id) => {
        let array = selectedRef.current;

        if (selectedRef.current.includes(id)) {
            array = selectedRef.current.filter((item) => item !== id);
            setSelectedGames(array);
        } else {
            array = [...array, id];
            setSelectedGames(array);
        }

        if (selectedRef.current.length === gameList.length && !selectAll) setSelectAll(true);
        else setSelectAll(false);
    };

    useEffect(() => {
        if (selectAll) {
            if (selectedRef.current.length < gameList.length) {
                let array = [];

                gameList.map((item) => {
                    array = [...array, item.id];

                    return array;
                });
                setSelectedGames(array);
            }
        } else setSelectedGames([]);
    }, [selectAll, gameList]);

    return (
        <Dialog open={open} onClose={handleCloseDialog} width="550px">
            <DialogTitle style={{ padding: '24px 24px 16px' }}>
                <p className="page-title">Select Games</p>
            </DialogTitle>
            <DialogContent dividers style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '40vh', overflowY: 'auto' }}>
                <FormControlLabel
                    label="Select All"
                    control={
                        <Checkbox checked={selectAll} indeterminate={selectedRef.current.length > 0 && selectedRef.current.length < gameList.length} onChange={(e) => setSelectAll(e.target.checked)} />
                    }
                    sx={{ margin: '0', fontSize: '0.7rem' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '32px' }}>
                    {gameList.map((game, index) => (
                        <FormControlLabel
                            key={index}
                            control={<Checkbox checked={selectedRef.current.includes(game.id)} onChange={(e) => handleRowSelection(game.id)} />}
                            sx={{ border: '1px solid #E8E8E8', borderRadius: '8px', margin: '0' }}
                            label={
                                <div style={{ display: 'flex', width: '420px', padding: '8px 6px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1.2 }}>
                                        <p className="normal-text">{game.home_team_name}</p>
                                        <p className="normal-text">{game.away_team_name}</p>
                                    </div>
                                    <p className="normal-text" style={{ flex: 1.2 }}>
                                        {game.league_name}
                                    </p>
                                    <p className="normal-text" style={{ flex: 0.6 }}>
                                        {game.season_name}
                                    </p>
                                </div>
                            }
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeamGameSelectDialog;
