import { Button, InputBase, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

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
        '&.Mui-focused fieldset': {
            borderColor: '#1A1B1D'
        }
    },
    '& .MuiInputBase-input': {
        backgroundColor: 'white'
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
    backgroundColor: '#fe5e00',
    color: 'white',
    '&:disabled': { backgroundColor: '#e8e8e8' },
    '&:hover': { backgroundColor: 'orange' }
}));

export { StyleTextField, BootstrapInput, SaveButton };