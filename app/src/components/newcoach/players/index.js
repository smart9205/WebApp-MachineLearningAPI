import { Box, Typography, TextField, InputAdornment, IconButton, CircularProgress, Select, MenuItem } from '@mui/material';
import React, { useEffect, useReducer } from 'react';

import SearchIcon from '@mui/icons-material/SearchOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../services/game.service';
import PlayerListItem from './playerListItem';
import { MenuProps } from '../components/common';

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
        teamFilter: 'none',
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

    const getTeamList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'team_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((team) => team === item.team_name);

                if (filter.length === 0) result = [...result, item.team_name];

                return result;
            });

            return result;
        }
    };

    const getPlayers = () => {
        return searchText
            ? playersList.filter((item) => compareStrings(item.team_name, searchText) || compareStrings(item.pos_name, searchText) || compareStrings(item.name, searchText))
            : teamFilter !== 'none'
            ? playersList.filter((item) => item.team_name === teamFilter)
            : playersList;
    };

    const getUniqueKey = (player) => {
        return `${player.id}-${player.coach_id}`;
    };

    useEffect(() => {
        setState({ loading: true });
        GameService.getMyCoachPlayerList().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'name'));

            setState({ playersList: ascArray, loading: false, teamList: getTeamList(res) });
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
                    <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Players</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>Team</Typography>
                                <Select
                                    value={teamFilter}
                                    onChange={handleChange('teamFilter')}
                                    label=""
                                    variant="outlined"
                                    IconComponent={ExpandMoreIcon}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    MenuProps={MenuProps}
                                    sx={{ borderRadius: '10px', outline: 'none', height: '36px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                >
                                    <MenuItem key="0" value="none">
                                        All
                                    </MenuItem>
                                    {teamList.map((team, index) => (
                                        <MenuItem key={index + 1} value={team}>
                                            {team}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <TextField
                                value={searchText}
                                onChange={handleChange('searchText')}
                                placeholder="Search"
                                label=""
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="outlined"
                                sx={{
                                    width: '300px',
                                    '& legend': { display: 'none' },
                                    '& fieldset': { top: 0 },
                                    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                                    '& .MuiOutlinedInput-input': { padding: 0, height: '36px' }
                                }}
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
                    <Box sx={{ overflowY: 'auto', maxHeight: '85vh', marginLeft: '24px' }}>
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
