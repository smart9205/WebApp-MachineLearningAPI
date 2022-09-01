import React, { useState, useRef } from 'react';
import S3 from 'react-aws-s3';
import { Box, CircularProgress } from '@mui/material';

import CameraIcon from '@mui/icons-material/PhotoCameraOutlined';

const UploadButton = ({ class_name, id_name, dirName, img, onURL, defaultImage }) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(img);
    const fileInput = useRef();
    const fileName = '';

    const getImage = () => {
        return img && img.length > 0 ? img : defaultImage;
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
                if (data.status === 204) {
                    setImage(data.location);
                    onURL(data.location);
                }
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    };

    return (
        <Box className={class_name} sx={{ width: '140px', height: '140px', borderRadius: '15px', background: `url(${getImage()}) center center / cover no-repeat silver` }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <input accept="image/*" id={id_name} type="file" ref={fileInput} onChange={(e) => handleUpload()} style={{ display: 'none' }} />
            <label htmlFor={id_name} style={{ width: '100%', cursor: 'pointer' }}>
                <Box sx={{ background: 'transparent', height: '110px' }} />
                <Box
                    sx={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: 'black',
                        borderRadius: '0 0 15px 15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        'svg path': { fill: 'white' }
                    }}
                >
                    <CameraIcon />
                </Box>
            </label>
        </Box>
    );
};

export default UploadButton;
