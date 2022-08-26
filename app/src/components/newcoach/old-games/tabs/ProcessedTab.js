import React, { useEffect, useState, useReducer } from 'react'
import {
    Box, Menu, MenuItem
} from '@mui/material'
import GameImage from '../../../../assets/game_image.png'
import TeamImage from '../../../../assets/logoAlone.png'
import MenuIcon from '@mui/icons-material/MenuOutlined';
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import gameService from '../../../../services/game.service';
import XmlDataFiltering from '../../../coach/XmlDataFiltering';
import ExcelDataFiltering from '../../../coach/ExcelDataFiltering';

const ProcessedTab = ({ allGamesList, seasonFilter, teamFilter, leagueFilter, teamList, period, setSeasonFilter,
    setTeamFilter,
    setLeagueFilter, }) => {

    const [gameState, setGameState] = useReducer((old, action) => ({ ...old, ...action }), {
        playerList: [],
        playersInGameList: [],
        allTagList: [],
        game: null,
        teamId: null
    })

    const { playerList, playersInGameList, allTagList, game, teamId } = gameState

    let processedGamesList = []

    const [gamesByCoach, setGamesByCoach] = useState()
    const [anchorEl, setanchorEl] = useState(null)
    const [exportXML, setExportXML] = useState(false)
    const [excelData, setExcelData] = useState(false)
    const [gameList, setGameList] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        allGamesList.map(data => {
            if (data.video_url !== "no video") {
                processedGamesList.push(data)
            }
            setGamesByCoach({ ...gamesByCoach, processedGamesList })
        })
    }, [allGamesList])

    const getActualGameDate = (gameDate) => {
        const getActualDate = new Date(gameDate)
        const date = getActualDate.getDate()
        const month = getActualDate.getMonth() + 1
        const year = getActualDate.getFullYear()
        return date + '/' + month + '/' + year
    }

    const handleClose = () => {
        setanchorEl(null)
    }

    const openMenu = (event) => {
        setanchorEl(event.currentTarget)
    }

    const downloadXML = async (game) => {

        setLoading(false)

        let selectedTeamId = []
        let selectedHomeTeamId = parseInt(game?.home_team_id)
        let selectedAwayTeamId = parseInt(game?.away_team_id)
        let gameId = parseInt(game?.id)

        setGameState({ game: game })

        let uniqueTeams = [];

        const unique = teamList.filter(element => {
            const isDuplicate = uniqueTeams.includes(element.id);
            if (!isDuplicate) {
                uniqueTeams.push(element.id);
                return true;
            }
            return false;
        });

        unique.map(data => {

            if (parseInt(data?.team_id) === selectedHomeTeamId || parseInt(data?.team_id) === selectedAwayTeamId) {
                selectedTeamId.push(data.team_id)
            }
            return false;

        })

        if (selectedTeamId.length > 1) {
            console.log('Multiple Team Id Found : ', selectedTeamId)
        } else if (!!selectedTeamId && !!gameId) {

            await gameService.getAllPlayerTagsByTeam(selectedTeamId, gameId).then((res) => {
                setGameState({ allTagList: res })
            })

            await gameService.getAllGameTeamPlayers(gameId).then((res) => {
                setGameState({ playersInGameList: res })
            })

            setLoading(true)
        }

        setGameState({ teamId: selectedTeamId })

    }

    const filterByTeam = async (gameListData) => {
        let filteredResult = []

        await gameListData && gameListData
            .filter((item) => parseInt(item.home_team_id) === parseInt(teamFilter) || parseInt(item.away_team_id) === parseInt(teamFilter) || parseInt(teamFilter) === 0)
            .map(game => {
                filteredResult.push(game)
            })

        return filteredResult
    }

    const filterBySeason = async (gameListData) => {
        let filteredResult = []

        await gameListData && gameListData
            .filter((item) => parseInt(item.season_id) === parseInt(seasonFilter) || parseInt(seasonFilter) === 0)
            .map(game => {
                filteredResult.push(game)
            })

        return filteredResult
    }

    const filterByLeague = async (gameListData) => {
        let filteredResult = []

        await gameListData && gameListData
            .filter((item) => parseInt(item.league_id) === parseInt(leagueFilter) || parseInt(leagueFilter) === 0)
            .map(game => {
                filteredResult.push(game)
            })

        return filteredResult
    }

    const filteredDataByFilters = async (gameData) => {
        await gameData
        const shallowData = [...gameData]
        let filteredData = []

        if (parseInt(leagueFilter) === 0 && parseInt(seasonFilter) === 0 && parseInt(teamFilter) === 0) {
            filteredData = shallowData
        }
        else {
            if (parseInt(teamFilter) !== 0) {

                let filtered = filterByTeam(shallowData)
                filteredData = filtered

                console.log('TeamFilter : ', filteredData)

                setSeasonFilter(0)
                setLeagueFilter(0)
            }

            if (parseInt(seasonFilter) !== 0) {

                let filtered = filterBySeason(shallowData)
                filteredData = filtered

                console.log('SeasonFilter : ', filteredData)

                setTeamFilter(0)
                setLeagueFilter(0)
            }

            if (parseInt(leagueFilter) !== 0) {

                let filtered = filterByLeague(shallowData)
                filteredData = filtered

                console.log('leagueFilter : ', filteredData)

                setTeamFilter(0)
                setSeasonFilter(0)
            }
        }

        return filteredData
    }

    useEffect(() => { setGameList(gamesByCoach?.processedGamesList) }, [gamesByCoach])

    useEffect(() => {
        const filterAllData = filteredDataByFilters(gamesByCoach?.processedGamesList)
        filterAllData.then(function (result) {
            setGameList(result)
        })
    }, [teamFilter, seasonFilter, leagueFilter])

    return (
        <Box sx={{ backgroundColor: '#F8F8F8' }}>
            {gameList && gameList
                .map((game, index) => (
                    <Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', gap: '18px', b0orderRadius: '10px', margin: '0 24px 24px', height: 'auto', '&:hover': { boxShadow: 3 } }} key={index}>
                        <Box>
                            <img style={{
                                width: '174px',
                                height: '100px',
                                borderRadius: '15px'
                            }} src={game.image ? game.image : GameImage} alt="" />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                            <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px' }}>{getActualGameDate(game.date)}</span>

                            <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', position: 'absolute', marginLeft: '100px' }}>{game.league_name}</span>
                            <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', position: 'absolute', marginLeft: '300px' }}>{game.season_name}</span>

                            <Box>
                                <img style={{ borderRadius: '5px', width: '24px' }} src={game.home_team_image ? game.home_team_image : TeamImage} alt="" />
                                <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{game.home_team_name}</label>
                            </Box>
                            <Box>
                                <img style={{ borderRadius: '5px', width: '24px' }} src={game.away_team_image ? game.away_team_image : TeamImage} alt="" />
                                <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{game.away_team_name}</label>
                            </Box>
                        </Box>
                        <Box sx={{ 'svg path': { fill: 'black' } }}>
                            <MenuIcon sx={{ cursor: 'pointer', display: 'block', position: 'absolute', right: '8rem' }} onClick={(e) => {
                                openMenu(e)
                                downloadXML(game)
                            }} />
                            <Menu
                                id='simple-menu'
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                elevation={1}
                            >
                                <MenuItem onClick={handleClose} value="1"><EditIcon /> Edit</MenuItem>
                                <hr style={{ margin: '1px' }} />

                                {loading &&
                                    <MenuItem onClick={() => {
                                        setExportXML(true)
                                        handleClose()
                                    }} value="2"><DownloadIcon />Export to Sportgate</MenuItem>
                                }

                                <hr style={{ margin: '1px' }} />
                                <MenuItem onClick={() => {
                                    setExcelData(true)
                                    handleClose()
                                }} value="3"><DownloadIcon /> Export to Excel</MenuItem>

                            </Menu>
                        </Box>
                    </Box>
                ))

            }
            {exportXML &&
                <XmlDataFiltering
                    game={game}
                    tags={allTagList}
                    teamId={teamId}
                    playerList={playerList}
                    playersInGameList={playersInGameList}
                    setExportXML={setExportXML}
                />
            }
            {excelData &&
                <ExcelDataFiltering
                    team={allTagList}
                    setExcelData={setExcelData}
                />
            }
        </Box>

    )
}

export default ProcessedTab