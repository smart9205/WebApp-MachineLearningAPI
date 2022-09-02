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
        fontSize: '14px',
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
        fontSize: '14px',
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
    fontSize: '14px',
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

export { StyleTextField, BootstrapInput, SearchText, SaveButton, MenuProps };
