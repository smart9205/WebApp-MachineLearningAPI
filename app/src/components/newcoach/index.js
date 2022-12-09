import { Box } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import Sidebar from './sidebar';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    return (
        <Box classes={classes['@global']} style={{ display: 'flex', minHeight: '100%' }}>
            <Sidebar t={t} />
            <Box style={{ backgroundColor: '#F8F8F8', flex: 1, display: 'flex', justifyContent: 'center' }}>{children}</Box>
        </Box>
    );
};

export default NewCoach;
