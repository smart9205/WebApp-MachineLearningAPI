import React from 'react';
import {
    Paper,
    Box,
    CardMedia,
} from '@mui/material';
import VIDEO_ICON from '../../assets/video_icon.jpg';
import moment from 'moment'

export default function PlayerDatailCard({ player }) {

    return (
        <Paper style={{ display: "flex" }} >
            <CardMedia
                sx={{ width: 150, marginRight: 2 }}
                component="img"
                image={VIDEO_ICON}
                alt="photo"
            />
            <Box style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                <div>
                    Name: <h6>{player.f_name} {player.l_name}</h6>
                </div>
                <div style={{ display: "flex" }}>
                    Jersey: <b> {player.jersey_number}</b>
                </div>
                <div>
                    Position: <h6>{player.position}</h6>
                </div>
                <div style={{ display: "flex" }}>
                    Birth: <b>{moment(player.date_of_birth).format('DD MMM, YYYY')}</b>
                </div>
            </Box>
        </Paper>
    )
}