import React from 'react';
import { Box, CircularProgress } from '@mui/material';

import GameTagListItem from './tagListItem';
import '../../../coach_style.css';

const GameTagList = ({ isLoading, expand, tagList, curTagListIdx, checkArr, onChecked, onVideo, onTime }) => {
    return tagList.length > 0 ? (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '25vh' : '63vh', minHeight: '25vh' }}>
            <Box sx={{ margin: '0 4px 8px 0', width: 'calc(100% - 4px)' }}>
                {tagList.map((tag, index) => (
                    <GameTagListItem
                        key={index}
                        item={tag}
                        isSelected={curTagListIdx === index}
                        idx={index}
                        isChecked={checkArr[index]}
                        onChecked={onChecked}
                        onShowVideo={onVideo}
                        onChangeTime={onTime}
                    />
                ))}
            </Box>
        </Box>
    ) : (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '20vh' : '63vh', minHeight: expand ? '20vh' : '63vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {tagList.length === 0 && !isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
                    <p className="page-tab">No Data to Display</p>
                </Box>
            )}
        </Box>
    );
};

export default GameTagList;
