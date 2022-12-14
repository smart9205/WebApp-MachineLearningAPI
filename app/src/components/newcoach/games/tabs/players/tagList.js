import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import GamePlayerTagListItem from './tagListItem';

const GamePlayerTagList = ({ isLoading, expand, tagList, curTagListIdx, checkArr, onChecked, onVideo, onTime, t }) => {
    return tagList.length > 0 ? (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '15vh' : '50vh', minHeight: '15vh' }}>
            <Box sx={{ margin: '0 4px 8px 0', width: 'calc(100% - 4px)' }}>
                {tagList.map((tag, index) => (
                    <GamePlayerTagListItem
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
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '15vh' : '50vh', minHeight: expand ? '15vh' : '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {tagList.length === 0 && !isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>{t('No Data to Display')}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default GamePlayerTagList;
