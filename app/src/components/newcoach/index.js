import { Box } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import Sidebar from './sidebar';

import './coach_style.css';

const useStyles = makeStyles((theme) => ({
    '@global': {
        html: {
            height: '100%'
        },
        body: {
            height: '100%'
        },
        '#root': {
            height: '100%'
        }
    }
}));

const NewCoach = ({ children }) => {
    const classes = useStyles();

    return (
        <Box classes={classes['@global']} style={{ display: 'flex', minHeight: '100%' }}>
            <Sidebar />
            <Box style={{ backgroundColor: '#F8F8F8', flex: 1, display: 'flex', justifyContent: 'center' }}>{children}</Box>
        </Box>
    );
};

export default NewCoach;
