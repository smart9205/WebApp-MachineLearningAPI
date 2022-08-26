import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import { PLAYER_ICON_DEFAULT } from '../../../common/staticData';
import { SaveButton, LoadingProgress } from '../components/common';
import UploadButton from '../components/uploadButton';
import GameService from '../../../services/game.service';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const PlayerEditDialog = ({ open, onClose, player }) => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        id: 0,
        f_name: '',
        l_name: '',
        date_of_birth: new Date(),
        position: null,
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
        setValues({
            ...values,
            id: player.id,
            f_name: player.f_name,
            l_name: player.l_name,
            date_of_birth: player.date_of_birth,
            position: player.position,
            jersey_number: player.jersey_number,
            image: player.image
        });
    }, [player, positions]);

    console.log('PlayerEdit => ', values);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" maxheight="initial">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'pointer' }} onClick={onClose}>
                    <CloseIcon sx={{ width: '14px', height: '14px' }} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>Close</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', margin: '0 200px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px', paddingBottom: '42px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Edit Player</Typography>
                <UploadButton
                    class_name="upload-player-view"
                    id_name="player-logo"
                    dirName={process.env.REACT_APP_DIR_PLAYER}
                    img={values.image}
                    onURL={(url) => setValues({ ...values, image: url })}
                    defaultImage={PLAYER_ICON_DEFAULT}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>First Name</Typography>
                            <TextField
                                value={values.f_name}
                                onChange={handleChange('f_name')}
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                placeholder="First Name"
                                sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Last Name</Typography>
                            <TextField
                                value={values.l_name}
                                onChange={handleChange('l_name')}
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                placeholder="Last Name"
                                sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Birthday</Typography>
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
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Jersey Number</Typography>
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
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Position</Typography>
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
                                <MenuItem key={index} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <SaveButton onClick={saveChanges} sx={{ width: '300px', fontSize: '16px' }}>
                    Save changes
                </SaveButton>
                {loading && <LoadingProgress />}
            </DialogContent>
        </Dialog>
    );
};

export default PlayerEditDialog;