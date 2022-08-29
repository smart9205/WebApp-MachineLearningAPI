import { Dialog, DialogContent, DialogTitle, Box, Typography, FormControlLabel, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { SaveButton, LoadingProgress } from '../components/common';
import UploadButton from '../components/uploadButton';
import GameService from '../../../services/game.service';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

const GameEditPage = ({ open, onClose, game, updateGameList }) => {
    const [values, setValues] = useState({
        image: '',
        mute: false,
        loading: false
    });

    const saveChanges = () => {
        onClose();
        setValues({ ...values, loading: true });
        GameService.updateGame({
            id: game.id,
            image: values.image,
            season_id: game.season_id,
            league_id: game.league_id,
            home_team_id: game.home_team_id,
            away_team_id: game.away_team_time,
            date: game.date,
            video_url: game.video_url,
            mobile_video_url: game.mobile_video_url,
            mute_video: values.mute
        }).then(() => {
            setValues({ ...values, loading: false });
            updateGameList(true);
        });
    };

    useEffect(() => {
        setValues({
            ...values,
            image: game.image,
            mute: game.mute_video
        });
    }, [game]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="2000px" maxheight="initial">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'pointer' }} onClick={onClose}>
                    <CloseIcon sx={{ width: '18px', height: '18px' }} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>Close</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', margin: '0 200px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px', paddingBottom: '42px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '28px', fontWeight: 700, color: '#1a1b1d' }}>Edit Game</Typography>
                <UploadButton
                    class_name="upload-game-view"
                    id_name="game-logo"
                    dirName={process.env.REACT_APP_DIR_GAME}
                    img={values.image}
                    onURL={(url) => setValues({ ...values, image: url })}
                    defaultImage={TEAM_ICON_DEFAULT}
                />
                <FormControlLabel
                    sx={{ mt: 1 }}
                    control={<Switch checked={values.mute} onChange={() => setValues({ ...values, mute: !values.mute })} inputProps={{ 'aria-label': 'controlled' }} />}
                    label="Mute Video"
                />
                <SaveButton disabled={values.image === game.image && values.mute === game.mute_video} onClick={saveChanges} sx={{ width: '300px', fontSize: '14px' }}>
                    Save changes
                </SaveButton>
                {values.loading && <LoadingProgress />}
            </DialogContent>
        </Dialog>
    );
};

export default GameEditPage;
