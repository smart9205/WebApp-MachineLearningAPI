import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, Typography, Box, TextField } from '@mui/material';

import { SaveButton, StyleTextField } from '../components';
import { updateProfile2 } from '../../../actions/auth';

import CameraIcon from '@mui/icons-material/PhotoCameraOutlined';

const profileList = [
    {
        id: 'firstName',
        title: 'First Name',
        placeholder: 'Daniel',
        error: 'First Name cannot be empty.',
        readonly: false
    },
    {
        id: 'lastName',
        title: 'Last Name',
        placeholder: 'Gutt',
        error: 'Last Name cannot be empty.',
        readonly: false
    },
    {
        id: 'email',
        title: 'Email',
        placeholder: 'gutt@scoutting4u.com',
        error: 'Email cannot be empty.',
        readonly: true
    },
    {
        id: 'phone',
        title: 'Phone Number',
        placeholder: '+X (XXX) XXX-XX-XX',
        error: 'Phone Number cannot be empty.',
        readonly: false
    },
    {
        id: 'country',
        title: 'Country',
        placeholder: 'Israel',
        error: 'Country cannot be empty.',
        readonly: false
    }
];

const PrfileTab = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [values, setValues] = useState({
        logoText: '',
        logoColor: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: ''
    });
    const [errors, setErrors] = useReducer((old, action) => ({ ...old, ...action }), {
        fileName: false,
        lastName: false,
        email: false,
        phone: false,
        country: false,
        confirm: false
    });
    const dispatch = useDispatch();

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const saveChanges = () => {
        const text = `${values.firstName.slice(0, 1)}${values.lastName.slice(0, 1)}`;
        const color = `#${(Math.random() % 256).toString(16)}${(Math.random() % 256).toString(16)}${(Math.random() % 256).toString(16)}`;

        setValues({ ...values, logoText: text, logoColor: color });
        dispatch(updateProfile2(values.firstName, values.lastName, values.phone, values.country));
    };

    useEffect(() => {
        setValues({
            ...values,
            firstName: currentUser.first_name,
            lastName: currentUser.last_name,
            email: currentUser.email,
            phone: currentUser.phone,
            country: currentUser.country
        });
    }, [currentUser]);

    useEffect(() => {
        setErrors({
            firstName: values.firstName.length === 0,
            lastName: values.lastName.length === 0,
            email: values.email.length === 0,
            phone: values.phone.length === 0,
            country: values.country.length === 0
        });
    }, [values]);

    console.log('Settings => ', currentUser);

    return (
        <Box sx={{ padding: '24px', backgroundColor: 'white', display: 'flex', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', maxHeight: '700px', height: '750px', overflowY: 'scroll' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {profileList.map((item) => (
                    <FormControl sx={{ gap: '4px' }} key={item.id}>
                        <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>{item.title}</Typography>
                        <TextField
                            value={values[item.id]}
                            label=""
                            inputProps={{ 'aria-label': 'Without label', readOnly: item.readonly }}
                            variant="outlined"
                            placeholder={item.placeholder}
                            onChange={handleChange(item.id)}
                            helperText={errors[item.id] ? item.error : ''}
                            error={errors[item.id]}
                            sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        />
                    </FormControl>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                    <SaveButton
                        disabled={!(values.firstName.length > 0 && values.lastName.length > 0 && values.email.length > 0 && values.phone.length > 0 && values.country.length > 0)}
                        onClick={saveChanges}
                        sx={{ width: '200px', fontSize: '16px' }}
                    >
                        Save changes
                    </SaveButton>
                </Box>
            </Box>
        </Box>
    );
};

export default PrfileTab;
