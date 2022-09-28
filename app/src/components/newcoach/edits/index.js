import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import EditTagTable from './tagtable';
import EditVideoPlayer from './videoplayer';
import EditFolderTreeView from './treeview';

const Edits = () => {
    const [editTagList, setEditTagList] = useState([]);
    const [curEdit, setCurEdit] = useState(null);
    const [tagLoading, setTagLoading] = useState(false);
    const [curTagIdx, setCurTagIdx] = useState(-1);
    const [videoData, setVideodata] = useState({
        idx: 0,
        autoPlay: true,
        videoPlay: false
    });

    const handleClickRow = (index) => {
        setVideodata({ ...videoData, idx: index });
        setCurTagIdx(index);
    };

    const handleSort = async (rows) => {
        await GameService.updateEditClipsSort(rows);
        await GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
            setEditTagList(res);
        });
    };

    useEffect(() => {
        setEditTagList([]);
        setCurTagIdx(-1);
        setVideodata({ ...videoData, idx: 0 });

        if (curEdit !== null && curEdit.type === 'edit') {
            setTagLoading(true);
            GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
                setEditTagList(res);
                setTagLoading(false);
                setCurTagIdx(0);
            });
        }
    }, [curEdit]);

    useEffect(() => {
        setCurTagIdx(0);
        setVideodata({ ...videoData, idx: 0 });
    }, [editTagList]);

    console.log('Edits => ', curTagIdx, editTagList);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>My Edits</Typography>
            </Box>
            <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', padding: '24px 0' }}>
                    <EditFolderTreeView setEdit={setCurEdit} isMain={true} entireHeight="95%" treeHeight="90%" />
                    <EditTagTable loading={tagLoading} tagList={editTagList} setIdx={handleClickRow} selected={curTagIdx} sort={handleSort} name={curEdit?.name ?? ''} update={setEditTagList} />
                </div>
                <EditVideoPlayer videoData={videoData} tagList={editTagList} onChangeClip={setCurTagIdx} drawOpen={true} />
            </Box>
        </Box>
    );
};

export default Edits;
