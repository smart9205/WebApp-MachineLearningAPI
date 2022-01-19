import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Tabs,
    Tab,
    Box,
} from '@mui/material';

import TeamTab from "./TeamTab"
import PlayerTab from "./PlayerTab"
import LeagueTab from "./LeagueTab"
import GameTab from "./game"

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
                <Box sx={{ p: 1 }}>
                    {children}
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
export default function Admin() {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Team" {...a11yProps(0)} />
                    <Tab label="Player" {...a11yProps(1)} />
                    <Tab label="League" {...a11yProps(2)} />
                    <Tab label="Game" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <TeamTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PlayerTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <LeagueTab />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <GameTab />
            </TabPanel>
        </div>
    )
}
