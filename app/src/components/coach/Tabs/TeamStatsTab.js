import { Box } from "@mui/material";
import React from "react";
import moment from 'moment'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const TeamStatsTab = ({ gameList }) => {

    const [games, setGames] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        if (value[value.length - 1] === "all") {
            setGames(gameList);
            return;
        }
        setGames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Box sx={{ width: "100%", textAlign: "center", marginTop: 20 }}>
            <FormControl sx={{ width: 600 }}>
                <InputLabel id="game-multiple-checkbox-label">Games</InputLabel>
                <Select
                    labelId="game-multiple-checkbox-label"
                    id="game-multiple-checkbox"
                    multiple
                    value={games}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((g) => (
                                <Chip key={g.id} label={`${g.home_team_name} VS ${g.away_team_name}`} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="all">
                        <Checkbox
                            checked={gameList.length > 0 && games.length === gameList.length}
                            indeterminate={games.length > 0 && games.length < gameList.length}
                            onChange={e => !e.target.checked && setGames([])}
                        />
                        <ListItemText
                            primary={'Select All'}
                        />
                    </MenuItem>
                    {gameList.map((g) => (
                        <MenuItem key={g.id} value={g}>
                            <Checkbox checked={games.indexOf(g) > -1} />
                            <ListItemText primary={`${moment(g.date).format('DD MMM, YYYY')} ${g.home_team_name} VS ${g.away_team_name}`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box >
    );
}

export default TeamStatsTab;