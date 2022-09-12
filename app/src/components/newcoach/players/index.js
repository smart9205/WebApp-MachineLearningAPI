import { Box, Typography, Autocomplete, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import React, { useEffect, useReducer } from 'react';

import SearchIcon from '@mui/icons-material/SearchOutlined';

import GameService from '../../../services/game.service';
import PlayerListItem from './playerListItem';

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

const Players = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        searchText: '',
        playersList: [],
        teamList: [],
        teamFilter: {},
        loading: false,
        hoverIndex: -1
    });

    const { searchText, playersList, teamList, teamFilter, loading, hoverIndex } = state;

    const handleChange = (prop) => (e) => {
        setState({ [prop]: e.target.value });
    };

    const compareStrings = (first, last) => {
        return first.toLowerCase().includes(last.toLowerCase());
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseEnter = (idx) => {
        setState({ hoverIndex: idx });
    };

    const handleMouseLeave = () => {
        setState({ hoverIndex: -1 });
    };

    const getPlayers = () => {
        return searchText
            ? playersList.filter((item) => compareStrings(item.team_name, searchText) || compareStrings(item.pos_name, searchText) || compareStrings(item.name, searchText))
            : teamFilter
            ? playersList.filter((item) => item.team_name === teamFilter.team_name)
            : playersList;
    };

    const getUniqueKey = (player) => {
        return `${player.id}-${player.coach_id}`;
    };

    useEffect(() => {
        setState({ loading: true });
        GameService.getMyCoachPlayerList().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'name'));

            setState({ playersList: ascArray });
        });
        GameService.getMyCoachTeamList().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'team_name'));

            setState({ teamList: ascArray, teamFilter: ascArray[0], loading: false });
        });
    }, []);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Players</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end', width: '100%', height: '80px' }}>
                            <Box sx={{ width: '300px' }}>
                                <Autocomplete
                                    id="combo-box-team-filter"
                                    options={teamList}
                                    fullWidth
                                    value={teamFilter}
                                    isOptionEqualToValue={(option, value) => option && option.team_name}
                                    getOptionLabel={(option) => (!option.team_name ? '' : option.team_name)}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.team_name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Team" sx={{ my: 1 }} />}
                                    onChange={(event, newValue) => {
                                        setState({ teamFilter: newValue, hoverIndex: -1 });
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
                    <Box sx={{ overflowY: 'auto', maxHeight: '70vh', marginLeft: '24px' }}>
                        <Box sx={{ marginRight: '4px' }}>
                            {getPlayers().map((player, index) => (
                                <Box key={getUniqueKey(player)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                                    <PlayerListItem row={player} isHover={hoverIndex === index} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Players;
