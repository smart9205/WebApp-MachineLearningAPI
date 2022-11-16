import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GameService from '../../services/game.service';
import SkillTab from './Tabs/SkillTab';
import StatisticTab from './Tabs/StatisticTab';
import HighlightTab from './Tabs/HighlightTab';
import { PlayerContext } from './index';

export default function GameDetailTab({ playTags, gameList, t }) {
    const { context, setContext } = useContext(PlayerContext);

    const playerId = context.player.id;
    const game = context.game;

    const [showHighlight, setShowHighlight] = useState(false);

    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        if (newValue === 0) setContext({ game: null });
        setValue(newValue);
    };

    useEffect(() => {
        if (!playerId || !game) return;

        GameService.getTeamByPlayerGame(playerId, game?.game_id).then((res) => {
            setShowHighlight(!!res.create_highlights);
        });
    }, [playerId, game]);

    return (
        <>
            <div className="skillsTab">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs" centered>
                        <Tab label={t('Games')} {...a11yProps(0)} />
                        <Tab label={t('Skills')} {...a11yProps(1)} />
                        <Tab label={t('Season Statistics')} {...a11yProps(2)} />
                        {showHighlight && <Tab label={t('Highlights')} {...a11yProps(3)} />}
                    </Tabs>
                </Box>
                <TabPanel value={value} index={1}>
                    <SkillTab playTags={playTags} onHighlight={() => setValue(3)} showHighlight={showHighlight} t={t} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <StatisticTab games={gameList} />
                </TabPanel>
                {showHighlight && (
                    <TabPanel value={value} index={3}>
                        <HighlightTab playTags={playTags} t={t} />
                    </TabPanel>
                )}
            </div>
        </>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
