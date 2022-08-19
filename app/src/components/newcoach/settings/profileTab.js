import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, Typography, Box, IconButton, InputAdornment } from '@mui/material';

import { SaveButton, StyleTextField } from '../components';
import { updateProfile1 } from '../../../actions/auth';

import CameraIcon from '@mui/icons-material/PhotoCameraOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const profileList = [
    {
        id: 'firstName',
        title: 'First Name',
        placeholder: 'Daniel',
        error: 'First Name cannot be empty.'
    },
    {
        id: 'lastName',
        title: 'Last Name',
        placeholder: 'Gutt',
        error: 'Last Name cannot be empty.'
    },
    {
        id: 'email',
        title: 'Email',
        placeholder: 'gutt@scoutting4u.com',
        error: 'Email cannot be empty.'
    },
    {
        id: 'phone',
        title: 'Phone Number',
        placeholder: '+X (XXX) XXX-XX-XX',
        error: 'Phone Number cannot be empty.'
    },
    {
        id: 'country',
        title: 'Country',
        placeholder: 'Israel',
        error: 'Country cannot be empty.'
    }
];

const passwordList = [
    {
        id: 'oldPassword',
        title: 'Old Password',
        show: 'showOldPassword'
    },
    {
        id: 'newPassword',
        title: 'New Password',
        show: 'showNewPassword'
    },
    {
        id: 'confirmPassword',
        title: 'Confirm Password',
        show: 'showConfirmPassword'
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
        country: '',
        oldPassword: '',
        showOldPassword: false,
        newPassword: '',
        showNewPassword: false,
        confirmPassword: '',
        showConfirmPassword: false
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
        if (values.confirmPassword === values.newPassword) {
            const text = `${values.firstName.slice(0, 1)}${values.lastName.slice(0, 1)}`;
            const color = `#${(Math.random() % 256).toString(16)}${(Math.random() % 256).toString(16)}${(Math.random() % 256).toString(16)}`;

            setValues({ ...values, logoText: text, logoColor: color });
            dispatch(updateProfile1(values.oldPassword, values.newPassword, values.firstName, values.lastName, values.email, values.phone, values.country));
        }
    };

    const handleClickShowPassword = (prop) => (event) => {
        const flag = !values[prop];

        setValues({ ...values, [prop]: flag });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
            country: values.country.length === 0,
            confirm: values.oldPassword.length === 0 || values.newPassword.length === 0 || values.confirmPassword.length === 0
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Box sx={{ display: 'flex', gap: '64px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {profileList.map((item) => (
                            <FormControl variant="standard" sx={{ gap: '4px' }} key={item.id}>
                                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1B1D' }}>{item.title}</Typography>
                                <StyleTextField
                                    value={values[item.id]}
                                    label=" "
                                    placeholder={item.placeholder}
                                    onChange={handleChange(item.id)}
                                    helperText={errors[item.id] ? item.error : ''}
                                    error={errors[item.id]}
                                    sx={{ width: '300px', height: '48px' }}
                                />
                            </FormControl>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {passwordList.map((pass) => (
                            <FormControl variant="outlined" sx={{ gap: '4px' }} key={pass.id}>
                                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{pass.title}</Typography>
                                <StyleTextField
                                    type={values[pass.show] ? 'text' : 'password'}
                                    value={values[pass.id]}
                                    label=" "
                                    placeholder="Enter password here"
                                    onChange={handleChange(pass.id)}
                                    helperText={errors.confirm ? 'Password cannot be empty' : ''}
                                    error={errors.confirm}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword(pass.show)}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' }, '&:focus': { backgroundColor: 'white' } }}
                                                >
                                                    {values[pass.show] ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ width: '300px', height: '48px' }}
                                />
                            </FormControl>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                    <SaveButton
                        disabled={
                            !(
                                values.firstName.length > 0 &&
                                values.lastName.length > 0 &&
                                values.email.length > 0 &&
                                values.phone.length > 0 &&
                                values.confirmPassword.length > 0 &&
                                values.newPassword.length > 0 &&
                                values.confirmPassword.length > 0
                            )
                        }
                        onClick={saveChanges}
                        sx={{ width: '400px', fontSize: '16px' }}
                    >
                        Save changes
                    </SaveButton>
                </Box>
            </Box>
        </Box>
    );
};

export default PrfileTab;
