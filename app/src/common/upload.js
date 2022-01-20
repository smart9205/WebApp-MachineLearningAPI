import React, { useState } from "react";
import S3 from "react-aws-s3";
import { DropzoneArea } from 'material-ui-dropzone';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import Input from '@mui/material/Input';
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

const useStyles = makeStyles((theme) => ({
    textContainer: {
        display: "none"
    },
    dropZone: {
        height: "100%",
        width: "100%",
        display: 'flex',
        alignItems: 'center'
    },
    previewImg: {
        width: 300
    },
    preview: {
        width: '100%',
        height: '100%',
        item: 'true',
        xs: '12',
    },
}));

function Upload({ dirName, img, onURL, fileName }) {
    const classes = useStyles();

    const [image, setImage] = useState(img)
    const [loading, setLoading] = useState(false)

    const handleUpload = (file) => {
        if (!file) return
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            dirName,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_ID,
            secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
            s3Url: process.env.REACT_APP_S3_URI
        };
        console.log("S3 config", config)
        const ReactS3Client = new S3(config);
        setLoading(true)
        ReactS3Client.uploadFile(file, fileName).then((data) => {
            console.log(data);
            if (data.status === 204) {
                console.log("success");
                setImage(data.location)
                onURL(data.location)
            } else {
                console.log("fail");
            }
            setLoading(false)
        }).catch((e) => {
            console.log("Uploading Error", e)
            setLoading(false)
        });
    };
    return (
        <div style={{ width: 300, margin: "auto", marginBottom: 10 }}>
            <CloudUploadIcon /> Upload Image
            <DropzoneArea
                acceptedFiles={['image/*']}
                filesLimit={1}
                dropzoneClass={classes.dropZone}
                previewGridClasses={{
                    item: classes.preview,
                }}
                getPreviewIcon={(file) => {
                    if (file.file.type.split('/')[0] === 'image')
                        return (
                            <img className={classes.previewImg} alt="img" role="presentation" src={file.data} />
                        );
                }}
                dropzoneText={"Upload image"}
                onChange={(files) => handleUpload(files[0])}
            />
            {
                loading ?
                    <div style={styles.loader}>
                        <CircularProgress />
                    </div>
                    : <div> {image} </div>
            }
            {/* <Input value={image} placeholder="Image URL" fullWidth multiline /> */}
        </div>
    );
}

export default Upload;