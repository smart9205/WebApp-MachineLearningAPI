import React, { useState, useEffect } from 'react';
import { Typography, Box, InputAdornment, IconButton } from '@mui/material';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ChevronDownIcon from '@mui/icons-material/ExpandMoreOutlined';
import ChevronUpIcon from '@mui/icons-material/ExpandLessOutlined';

import { SearchText } from '../components';
import GameService from '../../../services/game.service';
import TeamListItem from './teamListItem';

const Teams = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [values, setValues] = useState({
        searchText: ''
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const init = () => {
        setLoading(true);
        GameService.getAllMyCoachTeam().then((res) => {
            setRows(res);
            setLoading(false);
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleMouseEnter = (idx) => {
        setHoverIndex(idx);
    };

    const handleMouseLeave = () => {
        setHoverIndex(-1);
    };

    return (
        <Box sx={{ minWidth: '95%', margin: '0 auto' }}>
            <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Teams</Typography>
                    <SearchText
                        value={values.searchText}
                        onChange={handleChange('searchText')}
                        placeholder="Search"
                        sx={{ width: '304px', height: '42px', backgroundColor: 'white', borderRadius: '10px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' }, '&:focus': { backgroundColor: 'white' } }}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', gap: '16px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#A5A5A8' }}>Sort by</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px', 'svg path': { fill: 'black' } }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Name A-Z</Typography>
                        <ChevronDownIcon />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ margin: '0 24px 24px' }}>
                <Box sx={{ overflowY: 'scroll', maxHeight: '75vh' }}>
                    {rows.map((row, index) => (
                        <Box key={row.id} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                            <TeamListItem row={row} isHover={hoverIndex === index} />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', margin: '15px 24px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#A5A5A8' }}>Show by</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px', 'svg path': { fill: 'black' } }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>20</Typography>
                        <ChevronUpIcon />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Teams;
