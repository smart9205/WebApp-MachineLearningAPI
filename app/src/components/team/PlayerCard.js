import React from 'react';
import {
    Paper,
} from '@mui/material';

export default function PlayerCard({ player }) {

    return (
        <Paper sx={{ textAlign: 'center', fontSize: 12 }}>
            #{player.jersey_number}<br />{player.f_name} {player.l_name}
        </Paper>
    )
}
