import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

import '../../../coach_style.css';
import { SaveButton } from '../../../components/common';
import { getFormattedDate } from '../../../components/utilities';
import { Checkbox, FormControlLabel } from '@mui/material';

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: '0.7rem'
    },
    [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: 8,
            borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'}`,
            '&[aria-selected="true"]': {
                backgroundColor: 'rgba(46, 125, 50, 0.08)'
            },
            [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]: {
                backgroundColor: 'rgba(46, 125, 50, 0.08)'
            }
        }
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative'
    }
}));

function PopperComponent(props) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <StyledAutocompletePopper {...other} />;
}

PopperComponent.propTypes = {
    anchorEl: PropTypes.any,
    disablePortal: PropTypes.bool,
    open: PropTypes.bool.isRequired
};

const StyledPopper = styled(Popper)(({ theme }) => ({
    border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
    boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'}`,
    borderRadius: 6,
    width: 480,
    zIndex: theme.zIndex.modal,
    fontSize: '0.7rem',
    color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128'
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: 10,
    width: '100%',
    borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
    '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
        fontSize: '0.7rem',
        '&:focus': {
            boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light' ? 'rgba(3, 102, 214, 0.3)' : 'rgb(12, 45, 107)'}`,
            borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd'
        }
    }
}));

export default function GameSelectControl({ gameList, setIds }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState([]);
    const [pendingValue, setPendingValue] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const theme = useTheme();

    const handleClick = (event) => {
        setPendingValue(value);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setValue(pendingValue);
        setIds(pendingValue.map((item) => item.id));
        console.log(pendingValue);

        if (anchorEl) anchorEl.focus();

        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'github-label' : undefined;

    React.useEffect(() => {
        if (selectAll) setPendingValue(gameList);
        else setPendingValue([]);
    }, [selectAll]);

    return (
        <React.Fragment>
            <SaveButton sx={{ fontWeight: 500, width: '150px', height: '28px', fontSize: '0.9rem' }} endIcon={<SettingsIcon />} disableRipple aria-describedby={id} onClick={handleClick}>
                Select Games
            </SaveButton>
            <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        <Box
                            sx={{
                                borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                                padding: '8px 10px',
                                fontWeight: 600,
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize:'0.8rem'
                            }}
                        >
                            Please select games
                            <FormControlLabel
                            sx={{ mt: 1, marginLeft: '130px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.7rem' }}
                            control={<Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} inputProps={{ 'aria-label': 'controlled' }} />}
                            label="Select All"
                        />
                        </Box>

                        <Autocomplete
                            open
                            multiple
                            onClose={(event, reason) => {
                                if (reason === 'escape') {
                                    handleClose();
                                }
                            }}
                            value={pendingValue}
                            onChange={(event, newValue, reason) => {
                                if (event.type === 'keydown' && event.key === 'Backspace' && reason === 'removeOption') {
                                    return;
                                }
                                setPendingValue(newValue);
                            }}
                            disableCloseOnSelect
                            PopperComponent={PopperComponent}
                            renderTags={() => null}
                            noOptionsText="No Games"
                            renderOption={(props, option, { selected }) => (
                                <li key={option.id} {...props} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Box component={DoneIcon} sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }} style={{ visibility: selected ? 'visible' : 'hidden' }} />
                                    <div style={{ flexGrow: 1 }}>
                                        <p className="normal-text">{`${option.home_team_name} vs ${option.away_team_name}`}</p>
                                        <p className="normal-text">{`${option.league_name} ${option.season_name} ${getFormattedDate(option.date)}`}</p>
                                    </div>
                                    <Box component={CloseIcon} sx={{ opacity: 0.6, width: 18, height: 18 }} style={{ visibility: selected ? 'visible' : 'hidden' }} />
                                </li>
                            )}
                            options={gameList}
                            getOptionLabel={(option) => `${option.home_team_name} vs ${option.away_team_name}`}
                            renderInput={(params) => <StyledInput ref={params.InputProps.ref} inputProps={params.inputProps} autoFocus placeholder="Filter labels" />}
                        />
                    </div>
                </ClickAwayListener>
            </StyledPopper>
        </React.Fragment>
    );
}
