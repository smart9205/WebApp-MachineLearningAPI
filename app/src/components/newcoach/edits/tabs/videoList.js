import React, { useEffect } from 'react'
import TreeItem from '@mui/lab/TreeItem'


const VideoList = ({ tagList, videoData, onChangeClip }) => {

    return (
        <>
            {tagList && tagList.map((edit, idx) => (
                <h5 style={{ color: 'black' }} key={idx} >{edit.period_name}</h5>
            ))}
        </>
    )
}

export default VideoList