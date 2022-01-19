import React, { useState } from "react";
import S3 from "react-aws-s3";
import { DropzoneArea } from 'material-ui-dropzone';
import { makeStyles } from '@mui/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Input from '@mui/material/Input';

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

function Upload({ dirName, img, onURL }) {
    const classes = useStyles();

    const [image, setImage] = useState(img)

    const handleUpload = (file) => {
        if (!file) return
        let newFileName = file?.name.replace(/\..+$/, "");
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
        ReactS3Client.uploadFile(file, newFileName).then((data) => {
            console.log(data);
            if (data.status === 204) {
                console.log("success");
                setImage(data.location)
                onURL(data.location)
            } else {
                console.log("fail");
            }
        }).catch((e) => console.log("Uploading Error", e));
    };
    return (
        <div style={{ width: 300 }}>
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
            {image}
            {/* <Input value={image} placeholder="Image URL" fullWidth multiline /> */}
        </div>
    );
}

export default Upload;