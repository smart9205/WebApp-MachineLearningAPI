import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem, CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';

import { SaveButton, MenuProps } from '../components/common';
import UploadButton from '../components/uploadButton';
import GameService from '../../../services/game.service';

const PlayerEditDialog = ({ open, onClose, player, t }) => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        id: 0,
        f_name: '',
        l_name: '',
        date_of_birth: new Date(),
        position: '',
        jersey_number: 1,
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState([]);

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const saveChanges = () => {
        setLoading(true);
        GameService.updatePlayer(values)
            .then((res) => {
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
        onClose();
        navigate('/new_coach/players/');
    };

    useEffect(() => {
        setLoading(true);
        GameService.getAllPositions().then((res) => {
            setPositions(res);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (player !== null) {
            setValues({
                ...values,
                id: player.player_id,
                f_name: player.player_name.split(' ')[0],
                l_name: player.player_name.split(' ')[1],
                date_of_birth: player.date_of_birth ?? new Date(),
                position: player.player_position,
                jersey_number: player.player_jersey_number,
                image: player.image_url
            });
        }
    }, [player]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="1500px" maxheight="initial">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'pointer' }} onClick={onClose}>
                    <CloseIcon sx={{ width: '18px', height: '18px' }} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{t('Close')}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', margin: '0 30px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
                {values.loading && (
                    <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                )}
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '28px', fontWeight: 700, color: '#1a1b1d' }}>{t('Edit Player')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <UploadButton
                        class_name="upload-player-view"
                        id_name="player-logo"
                        dirName={process.env.REACT_APP_DIR_PLAYER}
                        img={values.image}
                        onURL={(url) => setValues({ ...values, image: url })}
                        defaultImage={PLAYER_ICON_DEFAULT}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>{t('FirstName')}</Typography>
                                <TextField
                                    value={values.f_name}
                                    onChange={handleChange('f_name')}
                                    label=""
                                    inputProps={{ 'aria-label': 'Without label', readOnly: true }}
                                    variant="outlined"
                                    placeholder="First Name"
                                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>{t('LastName')}</Typography>
                                <TextField
                                    value={values.l_name}
                                    onChange={handleChange('l_name')}
                                    label=""
                                    inputProps={{ 'aria-label': 'Without label', readOnly: true }}
                                    variant="outlined"
                                    placeholder="Last Name"
                                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>{t('Birthday')}</Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label=""
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        variant="outlined"
                                        value={values.date_of_birth}
                                        onChange={(v) => setValues({ ...values, date_of_birth: v })}
                                        renderInput={(params) => (
                                            <TextField sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }} {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>{t('Jersey Number')}</Typography>
                                <TextField
                                    value={values.jersey_number}
                                    onChange={handleChange('jersey_number')}
                                    label=""
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    variant="outlined"
                                    type="number"
                                    placeholder="Jersey Number"
                                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>{t('Position')}</Typography>
                            <Select
                                value={values.position}
                                onChange={handleChange('position')}
                                label=""
                                variant="outlined"
                                IconComponent={ExpandMoreIcon}
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                                sx={{ outline: 'none', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                            >
                                {positions.map((item, index) => (
                                    <MenuItem key={index} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                </Box>
                <SaveButton onClick={saveChanges} sx={{ width: '300px', fontSize: '14px' }}>
                    {t('Save changes')}
                </SaveButton>
            </DialogContent>
        </Dialog>
    );
};

export default PlayerEditDialog;
