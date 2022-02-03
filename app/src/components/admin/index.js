import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import {
    Tabs,
    Tab,
    Box,
} from '@mui/material';

import TeamTab from "./TeamTab"
import PlayerTab from "./PlayerTab"
import LeagueTab from "./LeagueTab"
import CoachTab from "./CoachTab"
import GameTab from "./GameTab"

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

const tablist = {
    game: 0,
    team: 1,
    player: 2,
    league: 3
}
export default function Admin() {
    const { tab } = useParams();
    const [value, setValue] = useState(tablist[tab] ?? 0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Game" {...a11yProps(0)} />
                    <Tab label="Team" {...a11yProps(1)} />
                    <Tab label="Player" {...a11yProps(2)} />
                    <Tab label="League" {...a11yProps(3)} />
                    <Tab label="Coach" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GameTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TeamTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <PlayerTab />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <LeagueTab />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <CoachTab />
            </TabPanel>
        </div>
    )
}
