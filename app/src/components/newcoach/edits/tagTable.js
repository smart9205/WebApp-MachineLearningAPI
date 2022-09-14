import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import CoachTeamTagTable from './teamTagTable';
import CoachPlayerTagTable from './playerTagList';

const EditTagTable = ({ loading, tagList, setList, setIdx, selected, sort }) => {
    const [teamTagList, setTeamTagList] = useState([]);
    const [playerTagList, setPlayerTagList] = useState([]);

    const getDisplayName = () => {
        return tagList.length === 0 ? 'No Tags' : teamTagList.length > 0 ? 'Team Tags' : playerTagList.length > 0 ? 'Player Tags' : 'No Tags';
    };

    useEffect(() => {
        const teams = tagList.filter((item) => item.team_tag_id !== null && item.player_tag_id === null);
        const players = tagList.filter((item) => item.team_tag_id === null && item.player_tag_id !== null);

        setTeamTagList(teams);
        setPlayerTagList(players);

        if (teams.length > 0) setList(teams);
        if (players.length > 0) setList(players);
    }, [tagList]);

    return (
        <Box sx={{ width: '500px', height: '100%', padding: '16px 8px', borderRight: '1px solid #E8E8E8' }}>
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
                </>
            )}
        </Box>
    );
};

export default EditTagTable;
