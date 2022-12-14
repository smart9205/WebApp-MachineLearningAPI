import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, Box, TextField } from '@mui/material';

import { SaveButton } from '../components/common';
import { updateProfile2 } from '../../../actions/auth';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';
import UploadButton from '../components/uploadButton';

import '../coach_style.css';

const profileList = [
    {
        id: 'firstName',
        title: 'FirstName',
        placeholder: 'Daniel',
        error: 'First Name cannot be empty.',
        readonly: false
    },
    {
        id: 'lastName',
        title: 'LastName',
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

const SettingsProfile = ({ t }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [values, setValues] = useState({
        logo: '',
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
        dispatch(updateProfile2(values.firstName, values.lastName, values.phone, values.country, values.logo));
    };

    useEffect(() => {
        setValues({
            ...values,
            logo: currentUser.image,
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

    return (
        <div className="tab-page settings-profile">
            <UploadButton
                class_name="upload-user-view"
                id_name="user-logo"
                dirName={process.env.REACT_APP_DIR_USER}
                img={values.logo}
                onURL={(url) => setValues({ ...values, logo: url })}
                defaultImage={USER_IMAGE_DEFAULT}
            />
            <div className="settings-password-container">
                <div className="grid-container">
                    {profileList.map((item) => (
                        <FormControl sx={{ gap: '4px' }} key={item.id}>
                            <p className="normal-text">{t(item.title)}</p>
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
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                    <SaveButton
                        disabled={!(values.firstName.length > 0 && values.lastName.length > 0 && values.email.length > 0 && values.phone.length > 0 && values.country.length > 0)}
                        onClick={saveChanges}
                        sx={{ width: '200px', fontSize: '0.7rem' }}
                    >
                        {t('Save changes')}
                    </SaveButton>
                </Box>
            </div>
        </div>
    );
};

export default SettingsProfile;
