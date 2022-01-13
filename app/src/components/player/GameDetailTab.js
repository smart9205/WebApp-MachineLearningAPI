import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import TagVideo from './TagVideo';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const useStyles = makeStyles(() => ({
    paper: { minWidth: "98%" },
}));
export default function BasicTabs({ curGame, playerId }) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Dialog
                classes={{ paper: classes.paper }}
                open={open}
                onClose={e => setOpen(false)}
            >
                <DialogContent sx={{ padding: 0.5 }}>
                    <TagVideo playerId={playerId} game={curGame} />
                </DialogContent>
            </Dialog>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Skills" {...a11yProps(0)} />
                    <Tab label="Statistics" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
        </Box>
    );
}
