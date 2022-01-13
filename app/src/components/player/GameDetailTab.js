import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import TagVideo from './TagVideo';
import GameService from "../../services/game.service";
import SkillTab from './Tabs/SkillTab';
import StatisticTab from './Tabs/StatisticTab';

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
const useStyles = makeStyles(() => ({
    paper: { minWidth: "98%" },
}));
export default function GameDetailTab({ game, playerId }) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [tagList, setTagList] = useState([])

    useEffect(() => {
        GameService.getAllPlayerTagsByPlayer(playerId, game?.game_id).then((res) => {
            console.log("Player Tag Result", res)
            setTagList(res)
        })
    }, [playerId, game])

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
                    <TagVideo tagList={tagList} url={game?.video_url} />
                </DialogContent>
            </Dialog>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Skills" {...a11yProps(0)} />
                    <Tab label="Statistics" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <SkillTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StatisticTab tagList={tagList} />
            </TabPanel>
        </Box>
    );
}
