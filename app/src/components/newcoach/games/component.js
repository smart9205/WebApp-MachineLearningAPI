import { Box } from '@mui/material';
import { Button, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3)
  },
  '& .MuiInputBase-input': {
    borderRadius: '8px',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? 'white' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: '16px',
    width: '300px',
    height: '48px',
    padding: '0 12px',
    marginLeft: '5px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(
      ','
    ),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.dark
    }
  }
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  height: '48px',
  textTransform: 'capitalize',
  fontFamily: 'sans-serif',
  fontWeight: 600,
  backgroundColor: '#fe5e00',
  marginLeft: '10rem',
  width: '200px',
  color: 'white',
  '&:disabled': { backgroundColor: '#e8e8e8' },
  '&:hover': { backgroundColor: 'orange' }
}));

export { BootstrapInput, UpdateButton };
