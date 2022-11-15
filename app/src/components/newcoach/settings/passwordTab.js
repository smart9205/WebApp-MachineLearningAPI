import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, InputAdornment, IconButton, TextField } from '@mui/material';

import { SaveButton } from '../components/common';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { updatepassword } from '../../../actions/auth';
import '../coach_style.css';

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

const SettingsPassword = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [values, setValues] = useState({
        oldPassword: '',
        showOldPassword: false,
        newPassword: '',
        showNewPassword: false,
        confirmPassword: '',
        showConfirmPassword: false
    });
    const [errors, setErrors] = useReducer((old, action) => ({ ...old, ...action }), {
        confirm: false
    });
    const { userdata } = useSelector((state) => state.resetpwd);
    const dispatch = useDispatch();

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = (prop) => (event) => {
        const flag = !values[prop];

        setValues({ ...values, [prop]: flag });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const saveChanges = () => {
        dispatch(updatepassword(currentUser.id, values.newPassword, values.confirmPassword));
    };

    useEffect(() => {
        setErrors({
            confirm: values.oldPassword.length === 0 || values.newPassword.length === 0 || values.confirmPassword.length === 0
        });
    }, [values]);

    return (
        <div className="tab-page">
            <div className="settings-password-container">
                {passwordList.map((pass) => (
                    <FormControl sx={{ gap: '4px' }} key={pass.id}>
                        <p className="normal-text">{pass.title}</p>
                        <TextField
                            type={values[pass.show] ? 'text' : 'password'}
                            value={values[pass.id]}
                            label=""
                            inputProps={{ 'aria-label': 'Without label' }}
                            variant="outlined"
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
                            sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        />
                    </FormControl>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                    <SaveButton
                        disabled={!(values.oldPassword.length > 0 && values.newPassword.length > 0 && values.confirmPassword.length > 0)}
                        onClick={saveChanges}
                        sx={{ width: '200px', fontSize: '0.7rem' }}
                    >
                        Update Password
                    </SaveButton>
                </Box>
            </div>
        </div>
    );
};

export default SettingsPassword;
