import React, { useState } from 'react';
import { FormControl, Typography, Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { StyleTextField, SaveButton } from '../components';

const PasswordTab = () => {
    const [values, setValues] = useState({
        oldPassword: '',
        showOldPassword: false,
        newPassword: '',
        showNewPassword: false,
        confirmPassword: '',
        showConfirmPassword: false
    });

    const handleClickShowOldPassword = () => {
        setValues({ ...values, showOldPassword: !values.showOldPassword });
    };

    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword });
    };

    const handleClickShowConfirmPassword = () => {
        setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box sx={{ padding: '24px 32px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', height: '700px' }}>
            <FormControl variant="outlined" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Old Password</Typography>
                <StyleTextField
                    type={values.showOldPassword ? 'text' : 'password'}
                    value={values.oldPassword}
                    label=" "
                    placeholder="Enter password here"
                    onChange={handleChange('oldPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowOldPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {values.showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: '300px', height: '48px' }}
                />
            </FormControl>
            <FormControl variant="outlined" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>New Password</Typography>
                <StyleTextField
                    type={values.showNewPassword ? 'text' : 'password'}
                    value={values.newPassword}
                    label=" "
                    placeholder="New Password"
                    onChange={handleChange('newPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowNewPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {values.showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: '300px', height: '48px' }}
                />
            </FormControl>
            <FormControl variant="outlined" sx={{ gap: '4px' }}>
                <Typography sx={{ fontSize: '14px', marginLeft: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Confirm Password</Typography>
                <StyleTextField
                    type={values.showConfirmPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    label=" "
                    placeholder="Confirm"
                    onChange={handleChange('confirmPassword')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {values.showOldPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: '300px', height: '48px' }}
                />
            </FormControl>
            <SaveButton disabled={!(values.confirmPassword.length > 0 || values.newPassword.length > 0 || values.confirmPassword.length > 0)} sx={{ width: '300px' }}>
                Update Password
            </SaveButton>
        </Box>
    );
};

export default PasswordTab;
