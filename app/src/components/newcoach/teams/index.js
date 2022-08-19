import React, { useState, useEffect } from 'react';
import { Typography, Box, InputAdornment, IconButton, Autocomplete, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ChevronDownIcon from '@mui/icons-material/ExpandMoreOutlined';
import ChevronUpIcon from '@mui/icons-material/ExpandLessOutlined';

import { SearchText } from '../components';
import GameService from '../../../services/game.service';
import TeamListItem from './teamListItem';

const Teams = () => {
    const [teamsList, setTeamsList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [seasonFilter, setSeasonFilter] = useState({});
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [values, setValues] = useState({
        searchText: '',
        teamCount: 0
    });

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    useEffect(() => {
        GameService.getAllMyCoachTeam().then((res) => {
            setTeamsList(res);
            setValues({ ...values, teamCount: teamsList.length });
        });
        GameService.getAllSeasons().then((res) => {
            setSeasonList(res);
            setSeasonFilter(res[0]);
        });
    }, [values.teamCount]);

    const handleMouseEnter = (idx) => {
        setHoverIndex(idx);
    };

    const handleMouseLeave = () => {
        setHoverIndex(-1);
    };

    console.log('Teams => ', seasonFilter);

    return (
        <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end', width: '100%' }}>
                    <Box sx={{ width: '400px' }}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={seasonList}
                            fullWidth
                            value={seasonFilter}
                            isOptionEqualToValue={(option, value) => option && option.name}
                            getOptionLabel={(option) => (!option.name ? '' : option.name)}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label="Season" sx={{ my: 1 }} />}
                            onChange={(event, newValue) => {
                                setSeasonFilter(newValue);
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#A5A5A8' }}>Sort by</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px', 'svg path': { fill: 'black' } }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>Name A-Z</Typography>
                            <ChevronDownIcon />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ margin: '24px' }}>
                <Box sx={{ overflowY: 'scroll', maxHeight: '75vh' }}>
                    {teamsList
                        .filter((item) => item.season_name === seasonFilter.name)
                        .map((team, index) => (
                            <Box key={team.id} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                <TeamListItem row={team} isHover={hoverIndex === index} />
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
