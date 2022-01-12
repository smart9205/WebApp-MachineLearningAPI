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
                sx={{ width: 200, marginRight: 2 }}
                component="img"
                // height="240"
                image={VIDEO_ICON}
                alt="photo"
            />
            <Box style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                <div>
                    Name: <h5>{player.f_name} {player.l_name}</h5>
                </div>
                <div>
                    Jersey: <h5>{player.jersey_number}</h5>
                </div>
                <div>
                    Position: <h5>{player.position}</h5>
                </div>
                <div>
                    Birth: <h5>{moment(player.date_of_birth).format('DD MMM, YYYY')}</h5>
                </div>
            </Box>
        </Paper>
    )
}