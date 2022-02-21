import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import TagVideo from './TagVideo';
import GameService from "../../services/game.service";
import SkillTab from './Tabs/SkillTab';
import StatisticTab from './Tabs/StatisticTab';
import HighlightTab from './Tabs/HighlightTab';
import { PlayerContext } from './index'
import useScreenOrientation from 'react-hook-screen-orientation'

const useStyles = makeStyles(() => ({
    paper: { minWidth: "98%", backgroundColor: "transparent" },
    landPaper: { minWidth: "80%", maxHeight: "100%", backgroundColor: "transparent" }
}));
export default function GameDetailTab() {
    const classes = useStyles();
    const { context, setContext } = useContext(PlayerContext)

    const screenOrientation = useScreenOrientation()
    const isLandscape = screenOrientation.split('-')[0] === "landscape"

    const playerId = context.player.id
    const game = context.game

    const [open, setOpen] = useState(false);
    const [tagList, setTagList] = useState([])
    const [playTags, setPlayTags] = useState([])
    const [showHighlight, setShowHighlight] = useState(false)

    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        if (newValue === 0)
            setContext({ game: null })
        setValue(newValue);
    };


    useEffect(() => {
        if (!playerId || !game) return
        GameService.getAllPlayerTagsByPlayer(playerId, game?.id).then((res) => {
            setTagList(res)
        })
        GameService.getTeamByPlayerGame(playerId, game?.id).then((res) => {
            setShowHighlight(!!res.create_highlights)
        })
    }, [playerId, game])

    return (
        <>
            <Dialog
                classes={{ paper: isLandscape ? classes.landPaper : classes.paper }}
                open={open}
                onClose={e => setOpen(false)}
            >
                <DialogContent sx={{ p: 0, }}>
                    <TagVideo tagList={playTags} url={game?.video_url} />
                </DialogContent>
            </Dialog>
            <div className='skillsTab'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs" centered>
                        <Tab label="Games" {...a11yProps(0)} />
                        <Tab label="Skills" {...a11yProps(1)} />
                        <Tab label="Statistics" {...a11yProps(2)} />
                        {showHighlight &&
                            <Tab label="My HighLights" {...a11yProps(3)} />
                        }
                    </Tabs>
                </Box>
                <TabPanel value={value} index={1}>
                    <SkillTab
                        tagList={tagList}
                        playTags={tags => { setPlayTags(tags); setOpen(true) }}
                        onHighlight={() => setValue(3)}
                        showHighlight={showHighlight}
                    />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <StatisticTab tagList={tagList} playTags={tags => { setPlayTags(tags); setOpen(true) }} />
                </TabPanel>
                {showHighlight &&
                    <TabPanel value={value} index={3}>
                        <HighlightTab playTags={tags => { setPlayTags(tags); setOpen(true) }} />
                    </TabPanel>
                }
            </div>
        </>
    );
}


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
