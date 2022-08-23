import React, { useState, useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import S3 from 'react-aws-s3';
import { FormControl, Typography, Box, TextField } from '@mui/material';

import CameraIcon from '@mui/icons-material/PhotoCameraOutlined';

import { LoadingProgress, SaveButton } from '../components';
import { updateProfile2 } from '../../../actions/auth';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';

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
    const fileInput = useRef();
    const [loading, setLoading] = useState(false);
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
    const dirName = process.env.REACT_APP_DIR_USER;
    const fileName = '';

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const saveChanges = () => {
        dispatch(updateProfile2(values.firstName, values.lastName, values.phone, values.country, values.logo));
    };

    const getImage = () => {
        return values.logo && values.logo.length > 0 ? values.logo : USER_IMAGE_DEFAULT;
    };

    const handleUpload = () => {
        const file = fileInput.current.files[0];
        if (!file) return;
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            dirName,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_ID,
            secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
            s3Url: process.env.REACT_APP_S3_URI
        };
        const ReactS3Client = new S3(config);
        setLoading(true);
        ReactS3Client.uploadFile(file, fileName)
            .then((data) => {
                if (data.status === 204) setValues({ ...values, logo: data.location });
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
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

    console.log('Settings => ', currentUser, values);

    return (
        <Box sx={{ padding: '24px', backgroundColor: 'white', display: 'flex', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', maxHeight: '700px', height: '750px', overflowY: 'scroll' }}>
            <Box sx={{ width: '140px', height: '140px', borderRadius: '15px', background: `url(${getImage()}) center center / cover no-repeat silver` }}>
                <input accept="image/*" id="photo" type="file" ref={fileInput} onChange={(e) => handleUpload()} style={{ display: 'none' }} />
                <label htmlFor="photo" style={{ width: '100%', cursor: 'pointer' }}>
                    <Box sx={{ background: 'transparent', height: '110px' }} />
                    <Box sx={{ width: '100%', height: '30px', backgroundColor: 'black', borderRadius: '0 0 15px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CameraIcon />
                    </Box>
                </label>
                {loading && <LoadingProgress />}
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
