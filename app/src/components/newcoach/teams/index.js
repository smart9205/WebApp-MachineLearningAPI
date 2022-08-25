import React, { useReducer, useEffect } from 'react';
import { Typography, Box, InputAdornment, IconButton, Autocomplete, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/SearchOutlined';

import { LoadingProgress } from '../components/common';
import GameService from '../../../services/game.service';
import TeamListItem from './teamListItem';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

const Teams = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        searchText: '',
        hoverIndex: -1,
        teamsList: [],
        seasonList: [],
        seasonFilter: {},
        loading: false
    });

    const { searchText, hoverIndex, teamsList, seasonList, seasonFilter, loading } = state;

    const handleChange = (prop) => (e) => {
        setState({ [prop]: e.target.value });
    };

    const compareStrings = (first, last) => {
        return first.toLowerCase().includes(last.toLowerCase());
    };

    const handleMouseEnter = (idx) => {
        setState({ hoverIndex: idx });
    };

    const handleMouseLeave = () => {
        setState({ hoverIndex: -1 });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        setState({ loading: true });
        GameService.getAllMyCoachTeam().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'team_name'));

            setState({ teamsList: ascArray });
        });
        GameService.getAllSeasons().then((res) => {
            const descArray = stableSort(res, getComparator('desc', 'id'));

            setState({ seasonList: descArray, seasonFilter: descArray[0], loading: false });
        });
    }, []);

    return (
        <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
            <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Teams</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end', width: '100%', height: '80px' }}>
                    <Box sx={{ width: '300px' }}>
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
                                setState({ seasonFilter: newValue });
                            }}
                        />
                    </Box>
                    <TextField
                        value={searchText}
                        onChange={handleChange('searchText')}
                        placeholder="Search"
                        label=""
                        inputProps={{ 'aria-label': 'Without label' }}
                        variant="outlined"
                        sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        onMouseDown={handleMouseDownPassword}
                                        sx={{ backgroundColor: '#F8F8F8', '&:hover': { backgroundColor: '#F8F8F8' }, '&:focus': { backgroundColor: '#F8F8F8' } }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ overflowY: 'auto', maxHeight: '70vh', margin: '0 24px' }}>
                <Box sx={{ marginRight: '16px' }}>
                    {(searchText
                        ? teamsList.filter((item) => compareStrings(item.team_name, searchText) || compareStrings(item.league_name, searchText) || compareStrings(item.season_name, searchText))
                        : seasonFilter
                        ? teamsList.filter((item) => item.season_name === seasonFilter.name)
                        : teamsList
                    ).map((team, index) => (
                        <Box key={team.id} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                            <TeamListItem row={team} isHover={hoverIndex === index} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {loading && <LoadingProgress />}
        </Box>
    );
};

export default Teams;
