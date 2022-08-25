import React, { useEffect } from 'react'
import TreeItem from '@mui/lab/TreeItem'
import { useState } from 'react'


const VideoList = ({ tagList, videoData, onChangeClip }) => {

    const [folder, setFolder] = useState(tagList)

    useEffect(() => {
        setFolder(tagList)
    }, [tagList])

    return (
        <>
            {folder && folder.map((edit, idx) => (
                <h5 style={{ color: 'black' }} key={idx} >{edit.name}</h5>
            ))}
        </>
    )
}

export default VideoList