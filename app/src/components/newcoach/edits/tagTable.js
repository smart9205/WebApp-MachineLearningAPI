import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

import CoachTeamTagTable from './teamTagTable';
import CoachPlayerTagTable from './playerTagList';
import { createCommand, toSecond } from '../../../common/utilities';

const EditTagTable = ({ loading, tagList, setList, setIdx, selected, sort, name }) => {
    const [teamTagList, setTeamTagList] = useState([]);
    const [playerTagList, setPlayerTagList] = useState([]);

    const getDisplayName = () => {
        return tagList.length === 0 ? 'No Tags' : teamTagList.length > 0 ? 'Team Tags' : playerTagList.length > 0 ? 'Player Tags' : 'No Tags';
    };

    const handleRender = () => {
        if (!Array.isArray(tagList)) return;

        let newList = [];
        const list = teamTagList.length > 0 ? [...teamTagList] : [...playerTagList];

        list.forEach((tag, i) => {
            let last = newList.at(-1);
            if (last && toSecond(last?.end_time ?? 0) >= toSecond(tag.start_time) && toSecond(last?.start_time ?? 0) <= toSecond(tag.start_time)) {
                last.end_time = last.end_time > tag.end_time ? last.end_time : tag.end_time;

                if (last.action_name && !last.action_name?.includes(tag.action_name)) last.action_name += ` && ${tag.action_name}`;
            } else {
                newList.push({ ...tag });
            }
        });

        createCommand(newList, name);
    };

    useEffect(() => {
        const teams = Array.isArray(tagList) ? tagList.filter((item) => item.team_tag_id !== null && item.player_tag_id === null) : [];
        const players = Array.isArray(tagList) ? tagList.filter((item) => item.team_tag_id === null && item.player_tag_id !== null) : [];

        setTeamTagList(teams);
        setPlayerTagList(players);

        if (teams.length > 0) setList(teams);
        if (players.length > 0) setList(players);
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
                    <Box sx={{ width: '100%', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{getDisplayName()}</Typography>
                    </Box>
                    {tagList.length > 0 && teamTagList.length > 0 && <CoachTeamTagTable tagList={teamTagList} setIndex={setIdx} selectIdx={selected} handleSort={sort} />}
                    {tagList.length > 0 && playerTagList.length > 0 && <CoachPlayerTagTable tagList={playerTagList} setIndex={setIdx} selectIdx={selected} handleSort={sort} />}
                    <Button variant="contained" style={{ margin: '1rem 0.5rem' }} onClick={handleRender}>
                        Render
                    </Button>
                </>
            )}
        </Box>
    );
};

export default EditTagTable;
