import { Checkbox, CircularProgress, FormControlLabel, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import GameService from '../../../../services/game.service';
import { PLAYER_ICON_DEFAULT } from '../../../../common/staticData';

const SettingsGamePlayerControl = ({ team, game }) => {
    const [playerList, setPlayerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playerIds, setPlayerIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const checkPlayers = (id) => {
        if (playerIds.includes(id)) {
            setPlayerIds((p) => p.filter((item) => item !== id));
            setSelectAll(false);
        } else {
            if (playerIds.length === playerList.length - 1) setSelectAll(true);

            setPlayerIds((p) => [...p, id]);
        }
    };

    useEffect(() => {
        setPlayerList([]);

        if (team && game) {
            setLoading(true);
            GameService.getGameCoachTeamPlayers(team.team_id, `${game.id}`).then((res) => {
                setPlayerList(res);
                setLoading(false);
            });
        }
    }, [team, game]);

    useEffect(() => {
        if (selectAll) playerList.map((item) => setPlayerIds((p) => [...p, item.player_id]));
        else {
            if (playerList.length > 0 && playerIds.length === playerList.length) setPlayerIds([]);
        }
    }, [selectAll]);

    console.log('academy_teams => ', playerList);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', textAlign: 'center', margin: 0 }}>Players</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #0a7304', borderRadius: '8px', width: '528px', height: '60vh', padding: '16px 12px' }}>
                <FormControlLabel control={<Checkbox checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />} label="Select All" sx={{ marginLeft: 0, color: 'black' }} />
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '8px', maxHeight: '56vh', overflowY: 'auto' }}>
                        {playerList.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid white',
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    width: '240px',
                                    borderBottom: '1px solid #b4b4b4'
                                }}
                            >
                                <IconButton color={playerIds.includes(item.player_id) ? 'error' : 'success'} onClick={() => checkPlayers(item.player_id)}>
                                    {playerIds.includes(item.player_id) ? <CloseIcon /> : <CheckBoxIcon />}
                                </IconButton>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px' }}>
                                    <img src={item.image ? item.image : PLAYER_ICON_DEFAULT} style={{ height: '60px', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: '#1c1d1a' }}>#{item.jersey_number}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: '#1c1d1a' }}>
                                            {`${item.first_name} ${item.last_name}`}
                                        </Typography>
                                    </div>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem', color: '#1c1d1a' }}>{item.name}</Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsGamePlayerControl;
