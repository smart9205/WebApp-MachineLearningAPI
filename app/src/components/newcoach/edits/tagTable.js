import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ExportIcon from '@mui/icons-material/FileDownloadOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';

import CoachTeamTagTable from './teamTagTable';
import { editCreateCommand, toSecond } from '../components/utilities';

const EditTagTable = ({ loading, tagList, setIdx, selected, sort, name }) => {
    const [teamTagList, setTeamTagList] = useState([]);

    const handleRender = () => {
        let newList = [];

        teamTagList.map((tag) => {
            let last = newList.at(-1);

            if (last && toSecond(last?.end_time ?? 0) >= toSecond(tag.start_time) && toSecond(last?.start_time ?? 0) <= toSecond(tag.start_time)) {
                last.end_time = last.end_time > tag.end_time ? last.end_time : tag.end_time;
            } else {
                newList.push({ ...tag });
            }
        });

        editCreateCommand(newList, name);
    };

    useEffect(() => {
        setTeamTagList(tagList);
    }, [tagList]);

    return (
        <Box sx={{ width: '500px', height: '100%', padding: '16px 8px', borderRight: '1px solid #E8E8E8', textAlign: 'center' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    {teamTagList.length === 0 && (
                        <Box sx={{ width: '100%', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>No Tags</Typography>
                        </Box>
                    )}
                    {teamTagList.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleRender}>
                                <ExportIcon />
                                Render
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }}>
                                <ContentCutIcon />
                                Move
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }}>
                                <ContentCopyIcon />
                                Copy
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }}>
                                <DeleteIcon />
                                Delete
                            </Button>
                        </Box>
                    )}
                    {tagList.length > 0 && teamTagList.length > 0 && <CoachTeamTagTable tagList={teamTagList} setIndex={setIdx} selectIdx={selected} handleSort={sort} />}
                    {teamTagList.length > 0 && (
                        <Button variant="contained" style={{ margin: '1rem 0.5rem' }} onClick={handleRender}>
                            Render
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default EditTagTable;
