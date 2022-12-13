import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import EditFolderTreeView from '../edits/treeview';
import VCVideoPlayer from './videoplayer';
import EditTagTable from '../edits/tagtable';
import GameService from '../../../services/game.service';
import '../coach_style.css';

const VideoCutter = ({ t }) => {
    const [curEdit, setCurEdit] = useState(null);
    const [editTagList, setEditTagList] = useState([]);
    const [tagLoading, setTagLoading] = useState(false);
    const [curTagIdx, setCurTagIdx] = useState(-1);
    const [refresh, setRefresh] = useState(false);

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
        setEditTagList([]);

        if (curEdit !== null && curEdit.type === 'edit') {
            GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
                setEditTagList(res);
                setRefresh(false);
            });
        }
    }, [refresh]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <p className="page-title">{t('Video Cutter')}</p>
            </Box>
            <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', padding: '12px 0' }}>
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
                        showPlay={true}
                    />
                </div>
                <VCVideoPlayer t={t} saveEdit={curEdit} drawOpen={true} updateList={setRefresh} />
            </Box>
        </Box>
    );
};

export default VideoCutter;
