import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import GameTagListItem from './tagListItem';

const GameTagList = ({ isLoading, expand, tagList, curTagListIdx, isAction, checkArr, onChecked, onVideo }) => {
    return (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '15vh' : '50vh', minHeight: '15vh' }}>
            {isLoading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <Box sx={{ margin: '0 4px 8px 0' }}>
                {tagList.map((tag, index) => (
                    <GameTagListItem item={tag} isSelected={curTagListIdx === index} displayAction={isAction} idx={index} isChecked={checkArr[index]} onChecked={onChecked} onShowVideo={onVideo} />
                ))}
            </Box>
            {tagList.length === 0 && !isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>No Data to Display</Typography>
                </Box>
            )}
        </Box>
    );
};

export default GameTagList;
