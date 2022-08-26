import React, { useEffect, useState, createContext, useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import i18next from 'i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton, CircularProgress, Box, Typography, Popover, List, ListItemButton, ListItemText } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import GameService from '../../services/game.service';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import TagVideo from './TagVideo';
import { makeStyles } from '@mui/styles';
import PlayerDetailCard from './PlayerDetailCard';
import GameDetailTab from './GameDetailTab';
import './Profile.css';
import { useTranslation } from 'react-i18next';
import GameImage from '../../assets/game_image.png';
import FilterIcon from '@mui/icons-material/FilterListOutlined';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    play: {
        color: '#07863d'
    },
    paper: { minWidth: '98%', maxHeight: 'none', backgroundColor: 'transparent' }
};
const defaultPrimaryColor = '#058240';
const defaultSecondColor = '#e7f3e5';

export const PlayerContext = createContext({
    context: {
        player: null,
        game: null,
        update_cnt: 0
    },
    setContext: () => {}
});

const useStyles = makeStyles(() => ({
    paper: { minWidth: '98%', backgroundColor: 'transparent' }
}));

export default function Player() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { data } = useParams();
    const playerId = Number(atob(data));
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [open, setOpen] = useState(false);
    const [playTags, setPlayTags] = useState([]);

    const [context, setContext] = useReducer((old, action) => ({ ...old, ...action }), {});

    const game = context.game;

    const value = useMemo(() => ({ context, setContext }), [context]);

    const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
    const [secondColor, setSecondColor] = useState(defaultSecondColor);
    const [language, setLanguage] = useState('en');
    const [hoverIndex, setHoverIndex] = useState(-1);

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const filterPopoverOpen = Boolean(filterAnchorEl);
    const filterPopoverId = filterPopoverOpen ? 'simple-popover' : undefined;

    const [seasonList, setSeasonList] = useState([]);
    const [seasonFilter, setSeasonFilter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    primary: { main: primaryColor },
                    secondary: { main: secondColor }
                }
            }),
        [primaryColor, secondColor]
    );

    useEffect(() => {
        setLoading(true);
        GameService.getGameDetailssByPlayer(playerId).then((res) => {
            const ascArray = stableSort(res, getComparator('desc', 'date'));

            setGames(ascArray);
            getSeasonList(res);
        });

        GameService.getPlayerById(playerId).then((res) => {
            setContext({ player: res });
            setPrimaryColor(res.team_color || defaultPrimaryColor);
            setSecondColor(res.second_color || defaultSecondColor);
            GameService.getTeamById(res.team_id).then((result) => {
                setLanguage(result.team_language);
            });
        });
        setLoading(false);
    }, [playerId]);

    useEffect(() => {
        i18next.changeLanguage(language);
        if (language == 'iw' || language == 'ar') {
            document.body.style.direction = 'rtl';
        } else {
            document.body.style.direction = 'ltr';
        }
    }, [language]);

    const numClicked = (gameId, key) => {
        GameService.getPlayerTagsByActionName(playerId, gameId, key).then((res) => {
            // setPlayTags(res); setOpen(true)
        });
    };

    const getImage = (item) => {
        return item.image && item.image.length > 0 ? item.image : GameImage;
    };

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]} / ${array[1]} / ${array[0]}`;
    };

    const handleListItemClick = (event, index) => {
        if (index === 0) setSeasonFilter('');
        else setSeasonFilter(seasonList[index - 1]);

        setSelectedIndex(index);
        setFilterAnchorEl(null);
    };

    const getGameList = () => {
        return seasonFilter && seasonFilter.length > 0 ? games.filter((game) => game.season_name === seasonFilter) : games;
    };

    const getSeasonList = (array) => {
        if (array.length > 0) {
            const desc = stableSort(array, getComparator('desc', 'season_name'));
            let result = [];

            desc.map((item) => {
                const filter = result.filter((season) => season === item.season_name);

                if (filter.length === 0) result = [...result, item.season_name];

                console.log('Player => ', item.season_name, result);
                return result;
            });
            setSeasonList(result);
        }
    };

    const { player: playerData, game: curGame } = context;

    return (
        <ThemeProvider theme={theme}>
            <PlayerContext.Provider value={value}>
                {loading && (
                    <div style={styles.loader}>
                        <CircularProgress />
                    </div>
                )}
                <Box className="profileSection">
                    <Dialog className="profileSection_tagvideo" classes={{ paper: classes.paper }} open={open} onClose={(e) => setOpen(false)}>
                        <DialogContent sx={{ p: 0 }}>
                            <TagVideo tagList={playTags} url={game?.mobile_video_url ? game?.mobile_video_url : game?.video_url} muteState={game?.mute_video} setOpen={setOpen} />
                        </DialogContent>
                    </Dialog>
                    {playerData && <PlayerDetailCard player={playerData} />}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '18px 20px' }}>
                        <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
                            <FilterIcon />
                        </IconButton>
                    </Box>
                    <Popover
                        id={filterPopoverId}
                        open={filterPopoverOpen}
                        anchorEl={filterAnchorEl}
                        onClose={() => setFilterAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <List component="nav" aria-label="secondary mailbox folder">
                            <ListItemButton key="0" selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                                <ListItemText primary="All" />
                            </ListItemButton>
                            {seasonList.map((season, index) => (
                                <ListItemButton key={index + 1} selected={selectedIndex === index + 1} onClick={(event) => handleListItemClick(event, index + 1)}>
                                    <ListItemText primary={season} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Popover>
                    {!curGame &&
                        getGameList().map((item, index) => (
                            <Box
                                key={index}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(-1)}
                                sx={{
                                    display: 'flex',
                                    gap: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #F8F8F8',
                                    margin: '2px 8px',
                                    padding: '8px 16px 8px 8px',
                                    boxShadow: hoverIndex === index ? '0px 4px 16px rgba(0, 0, 0, 0.1)' : 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setContext({ game: item })}
                            >
                                <Box sx={{ borderRadius: '10px', background: `url(${getImage(item)}) center center / cover no-repeat silver`, width: '120px', height: '70px', marginBottom: '12px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '52px', width: '120px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            {item.home_team_image && <img src={item.home_team_image} style={{ width: '32px', height: '32px' }} />}
                                            {item.away_team_image && <img src={item.away_team_image} style={{ width: '32px', height: '32px' }} />}
                                        </Box>
                                    </Box>
                                    <IconButton color="primary" sx={{ padding: 0 }} onClick={() => setContext({ game: null })}>
                                        <PlayCircleOutlineIcon sx={{ width: '36px', height: '36px' }} />
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '2px', flexDirection: 'column', flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500, color: '#1a1b1d' }}>{getFormattedDate(item.date)}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500, color: '#1a1b1d' }}>{item.season_name}</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500, color: '#1a1b1d' }}>{item.league_name}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#1a1b1d' }}>{item.home_team_goal}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#1a1b1d' }}>{item.home_team_name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#1a1b1d' }}>{item.away_team_goal}</Typography>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#1a1b1d' }}>{item.away_team_name}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    {curGame && (
                        <GameDetailTab
                            playTags={(tags) => {
                                setPlayTags(tags);
                                setOpen(true);
                            }}
                            t={t}
                        />
                    )}
                </Box>
            </PlayerContext.Provider>
        </ThemeProvider>
    );
}
