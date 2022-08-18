import React, { useState } from 'react';
import { FormControl, Typography, Box } from '@mui/material';

import { BootstrapInput, SaveButton } from '../../components';

import CameraIcon from '@mui/icons-material/PhotoCameraOutlined';

const PrfileTab = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const saveChanges = () => {};

    return (
        <Box sx={{ padding: '24px', backgroundColor: 'white', display: 'flex', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', height: '700px' }}>
            <Box
                sx={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '15px',
                    background: 'url("https://api.static.newstream.ai/media/backend_api_account/coach/e593b826-e858-41ea-bac6-1a7f53f2a311./tmp/tmpsgjzfqh9.128x128_q85_crop.jpg")'
                }}
            >
                <input style={{ display: 'none' }} id="photo" type="file" accept="image/*" />
                <label htmlFor="photo" style={{ width: '100%', cursor: 'pointer' }}>
                    <Box sx={{ background: 'transparent', height: '110px' }} />
                    <Box sx={{ width: '100%', height: '30px', backgroundColor: 'black', borderRadius: '0 0 15px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CameraIcon />
                    </Box>
                </label>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <FormControl variant="standard" sx={{ gap: '4px' }}>
                    <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Role</Typography>
                    <BootstrapInput inputProps={{ readOnly: true }} />
                </FormControl>
                <FormControl variant="standard" sx={{ gap: '4px' }}>
                    <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>First Name</Typography>
                    <BootstrapInput onChange={handleChange('firstName')} />
                </FormControl>
                <FormControl variant="standard" sx={{ gap: '4px' }}>
                    <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Last Name</Typography>
                    <BootstrapInput onChange={handleChange('lastName')} />
                </FormControl>
                <FormControl variant="standard" sx={{ gap: '4px' }}>
                    <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Email</Typography>
                    <BootstrapInput onChange={handleChange('email')} />
                </FormControl>
                <FormControl variant="standard" sx={{ gap: '4px' }}>
                    <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>Phone</Typography>
                    <BootstrapInput placeholder="+X (XXX) XXX-XX-XX" onChange={handleChange('phone')} />
                </FormControl>
                <SaveButton disabled={!(values.firstName.length > 0 || values.lastName.length > 0 || values.email.length > 0 || values.phone.length > 0)} onClick={saveChanges}>
                    Save changes
                </SaveButton>
            </Box>
        </Box>
    );
};

export default PrfileTab;
