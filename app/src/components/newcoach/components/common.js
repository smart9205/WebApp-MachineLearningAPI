import { Button, InputBase, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyleTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: '#1A1B1D'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#1A1B1D'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#1A1B1D'
        },
        '&:hover fieldset': {
            borderColor: '#1A1B1D'
        },
        '& .Mui-focused fieldset': {
            borderColor: '#1A1B1D'
        },
        borderRadius: '10px'
    },
    '& .MuiInputBase-input': {
        backgroundColor: 'white'
    }
}));

const SearchText = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: 'white'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white'
        },
        '&:hover fieldset': {
            borderColor: 'white'
        },
        '& .Mui-focused fieldset': {
            borderColor: 'white'
        },
        paddingLeft: '8px',
        borderRadius: '10px'
    },
    '& .MuiInputBase-input': {
        padding: '10px 10px 10px 0px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.7rem',
        fontWeight: 700
    },
    '& .MuiInputAdornment-root': {
        margin: 0
    }
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3)
    },
    '& .MuiInputBase-input': {
        width: '300px',
        height: '48px',
        borderRadius: '10px',
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? 'white' : '#2b2b2b',
        border: '2px solid #e8e8e8',
        fontSize: '0.7rem',
        lineHeight: '20px',
        padding: '0 16px',
        transition: 'border-color 0.15s ease-in-out 0s',
        fontFamily: ['DM Sans', 'sans-serif'].join(','),
        '&:focus': {
            borderColor: '#1A1B1D'
        }
    }
}));

const SaveButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    height: '48px',
    textTransform: 'capitalize',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: '0.7rem',
    backgroundColor: '#0A7304',
    color: 'white',
    '&:disabled': { backgroundColor: '#e8e8e8' },
    '&:hover': { backgroundColor: '#C5EAC6' }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200
        }
    }
};

const ActionData = {
    All: { action_id: null, action_type_id: null, action_result_id: null },
    YellowCard: { action_id: null, action_type_id: '9', action_result_id: null },
    RedCard: { action_id: null, action_type_id: '10', action_result_id: null },
    GoalKick: { action_id: '1', action_type_id: null, action_result_id: null },
    GoalOpportunity: { action_id: '1', action_type_id: null, action_result_id: '1' },
    ShotOffTarget: { action_id: '1', action_type_id: null, action_result_id: '2' },
    Goal: { action_id: '1', action_type_id: null, action_result_id: '3' },
    PenaltyMissed: { action_id: '1', action_type_id: '13', action_result_id: '2' },
    FreeKick: { action_id: '1,2,3', action_type_id: '11,13', action_result_id: null },
    Passes: { action_id: '2', action_type_id: null, action_result_id: null },
    ShortPass: { action_id: '2', action_type_id: '4', action_result_id: null },
    LongPass: { action_id: '2', action_type_id: '5', action_result_id: null },
    PassesSuccess: { action_id: '2', action_type_id: null, action_result_id: '4' },
    ThroughPass: { action_id: '2', action_type_id: '6', action_result_id: null },
    KeyPass: { action_id: '2', action_type_id: '7', action_result_id: null },
    PassesShots: { action_id: '2', action_type_id: '15', action_result_id: null },
    Corner: { action_id: '2,3', action_type_id: '12', action_result_id: null },
    BuildUp: { action_id: '2,4', action_type_id: null, action_result_id: null },
    Turnover: { action_id: '2,7', action_type_id: null, action_result_id: '5,11,12,15' },
    Cross: { action_id: '3', action_type_id: '1,2,3,4,5,6,7,8,9,10,13,14,15', action_result_id: null },
    Dribble: { action_id: '4', action_type_id: null, action_result_id: null },
    DribbleSuccess: { action_id: '4', action_type_id: null, action_result_id: '4' },
    Penalty: { action_id: '4', action_type_id: null, action_result_id: '14' },
    Foul: { action_id: '5', action_type_id: null, action_result_id: null },
    DrawFoul: { action_id: '6', action_type_id: null, action_result_id: null },
    Offside: { action_id: '7', action_type_id: null, action_result_id: '15' },
    Saved: { action_id: '8', action_type_id: null, action_result_id: null },
    Interception: { action_id: '10', action_type_id: null, action_result_id: null },
    Clearance: { action_id: '11', action_type_id: null, action_result_id: null },
    Tackle: { action_id: '12', action_type_id: null, action_result_id: null },
    Blocked: { action_id: '13', action_type_id: null, action_result_id: '7,19' },
    SuperSaved: { action_id: '17', action_type_id: null, action_result_id: null },
    AirChallenge: { action_id: '18', action_type_id: null, action_result_id: null },
    GroundChallenge: { action_id: '19', action_type_id: null, action_result_id: null },
    One: { action_id: '20', action_type_id: null, action_result_id: null },
    GoalReceive: { action_id: '22', action_type_id: null, action_result_id: null },
    Exits: { action_id: '5,6,10,11,12,13,14,15,20', action_type_id: null, action_result_id: null },
    
};

export { StyleTextField, BootstrapInput, SearchText, SaveButton, MenuProps, ActionData };
