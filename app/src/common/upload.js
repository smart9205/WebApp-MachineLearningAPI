import React, { useState, useRef } from "react";
import S3 from "react-aws-s3";
import Box from '@mui/material/Box';
import { styled } from '@mui/styles';

import { CircularProgress, Button } from '@mui/material';

const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
};

const Input = styled('input')({
    display: 'none',
});

function Upload({ dirName, img, onURL, fileName, defaultImg = "", btn_name = "Upload" }) {
    const fileInput = useRef();
    const [image, setImage] = useState(img)
    const [loading, setLoading] = useState(false)

    const handleUpload = () => {
        const file = fileInput.current.files[0];
        if (!file) return
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            dirName,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_ID,
            secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
            s3Url: process.env.REACT_APP_S3_URI
        };
        const ReactS3Client = new S3(config);
        setLoading(true)
        ReactS3Client.uploadFile(file, fileName).then((data) => {
            if (data.status === 204) {
                setImage(data.location)
                onURL(data.location)
            } else {
            }
            setLoading(false)
        }).catch((e) => {
            setLoading(false)
        });
    };
    return (
        <Box style={{ textAlign: "center", width: 200, margin: "auto" }} >
            <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" type="file" ref={fileInput} onChange={(e) => handleUpload()} />
                <Button variant="contained" component="span" >
                    {btn_name}
                </Button>
            </label><br />
            <img
                className="upload-image-preview"
                src={image && image.length > 0 ? image : defaultImg}
                width="200"
                alt="img"
                style={{ border: "1px black solid" }}>
            </img>
            {
                loading &&
                <div style={styles.loader}>
                    <CircularProgress />
                </div>
            }
        </Box >
    );
}

export default Upload;