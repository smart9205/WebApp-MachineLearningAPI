import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import GameService from '../../../services/game.service';
import EditTagTable from './tagtable';
import EditVideoPlayer from './videoplayer';
import EditFolderTreeView from './treeview';

const Edits = ({ t }) => {
    const [editTagList, setEditTagList] = useState([]);
    const [curEdit, setCurEdit] = useState(null);
    const [tagLoading, setTagLoading] = useState(false);
    const [curTagIdx, setCurTagIdx] = useState(-1);

    const handleClickRow = (index) => {
        setCurTagIdx(index);
    };

    const handleSort = async (rows, isDropped) => {
        if (!isDropped) await GameService.updateEditClipsSort(rows);
        else await handleUpdateTable();
    };

    const handleUpdateTable = async () => {
        await GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
            setEditTagList(res);
        });
    };

    useEffect(() => {
        setEditTagList([]);
        setCurTagIdx(-1);

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
    }, [editTagList]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ width: '100%', padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#1a1b1d' }}>{t('My Edits')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', padding: '10px 0' }}>
                    <EditFolderTreeView t={t} setEdit={setCurEdit} isMain={true} entireHeight="95%" treeHeight="90%" />
                    <EditTagTable
                        t={t}
                        loading={tagLoading}
                        tagList={editTagList}
                        setIdx={handleClickRow}
                        selected={curTagIdx}
                        sort={handleSort}
                        name={curEdit?.name ?? ''}
                        update={handleUpdateTable}
                        showPlay={false}
                    />
                </div>
                <EditVideoPlayer idx={curTagIdx} tagList={editTagList} onChangeClip={setCurTagIdx} drawOpen={true} />
            </Box>
        </Box>
    );
};

export default Edits;
