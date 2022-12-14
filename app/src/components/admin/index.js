import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Box } from '@mui/material';

import TeamTab from './TeamTab';
import PlayerTab from './PlayerTab';
import LeagueTab from './LeagueTab';
import CoachTab from './CoachTab';
import GameTab from './GameTab';
import AdminTool from './tool';
import RepresentativeTab from './RepresentativeTab';
import AcademyCoachTab from './AcademyCoachTab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const tablist = {
    game: 0,
    team: 1,
    player: 2,
    league: 3
};
export default function Admin() {
    const { t } = useTranslation();
    const { tab } = useParams();
    const [value, setValue] = useState(tablist[tab] ?? 0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label={t('Games')} {...a11yProps(0)} />
                    <Tab label={t('Teams')} {...a11yProps(1)} />
                    <Tab label={t('Players')} {...a11yProps(2)} />
                    <Tab label={t('Leagues')} {...a11yProps(3)} />
                    <Tab label={t('Coaches')} {...a11yProps(4)} />
                    <Tab label={t('Tool')} {...a11yProps(5)} />
                    <Tab label="Representatives" {...a11yProps(6)} />
                    <Tab label="Academy Coaches" {...a11yProps(7)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GameTab t={t} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TeamTab t={t} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <PlayerTab t={t} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <LeagueTab t={t} />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <CoachTab t={t} />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <AdminTool />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <RepresentativeTab />
            </TabPanel>
            <TabPanel value={value} index={7}>
                <AcademyCoachTab />
            </TabPanel>
        </div>
    );
}
