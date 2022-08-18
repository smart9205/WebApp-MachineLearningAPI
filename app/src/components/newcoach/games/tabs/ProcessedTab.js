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

const ProcessedTab = ({ allGamesList, teamList, period, teamSelection, seasonSelection, leagueSelection }) => {

    const [gameState, setGameState] = useReducer((old, action) => ({ ...old, ...action }), {
        playerList: [],
        playersInGameList: [],
        allTagList: [],
        game: null,
        teamId: null
    })

    const { playerList, playersInGameList, allTagList, game, teamId } = gameState

    let processedGamesList = []
    let filteredByTeamGames = []
    let filteredBySeasonGames = []
    let filteredByLeagueGames = []

    const [gamesByCoach, setGamesByCoach] = useState()
    const [anchorEl, setanchorEl] = useState(null)
    const [exportXML, setExportXML] = useState(false)
    const [excelData, setExcelData] = useState(false)
    const [gameList, setGameList] = useState()

    useEffect(() => {
        allGamesList.map(data => {
            if (data.video_url !== "NO VIDEO") {
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

    const downloadXML = (game) => {

        let selectedTeamId = []
        let selectedHomeTeamId = parseInt(game?.home_team_id)
        let selectedAwayTeamId = parseInt(game?.away_team_id)

        setGameState({ game: game })

        teamList.map(data => {
            if (parseInt(data?.team_id) === selectedHomeTeamId || parseInt(data?.team_id) === selectedAwayTeamId) {
                selectedTeamId.push(data)
            }
        })

        if (selectedTeamId.length > 1) {
            console.log('Multiple Team Id Found : ', selectedTeamId)
        } else {
            if (!!selectedTeamId && !!game) {

                gameService.getAllPlayerTagsByTeam(selectedTeamId[0]?.team_id, game?.id).then((res) => {
                    setGameState({ allTagList: res })
                })

                gameService.getGameTeamPlayersByTeam(selectedTeamId[0]?.team_id, game?.id).then((res) => {
                    setGameState({ playerList: res })
                })

                gameService.getAllGameTeamPlayers(game?.id).then((res) => {
                    setGameState({
                        playersInGameList: res
                    })
                })
            }
            setGameState({ teamId: selectedTeamId[0].team_id })
        }
    }


    const filterByTeam = async () => {
        await gamesByCoach?.processedGamesList?.map(game => {
            if (parseInt(teamSelection) === parseInt(game.home_team_id) || parseInt(teamSelection) === parseInt(game.away_team_id)) {
                filteredByTeamGames.push(game)
            } else if (parseInt(teamSelection) === 0) {
                filteredByTeamGames.push(game)
            }
        })
    }

    const filterBySeason = async () => {
        await gamesByCoach?.processedGamesList?.map(game => {
            if (parseInt(seasonSelection) === parseInt(game.season_id)) {
                filteredBySeasonGames.push(game)
            } else if (parseInt(seasonSelection) === 0) {
                filteredBySeasonGames.push(game)
            }
        })
    }

    useEffect(() => {
        filterBySeason()
        filterByTeam()
        // console.log(gamesByCoach?.processedGamesList)
        // setGameList(filterBySeason)
        setGameList(filteredByTeamGames)
    }, [gamesByCoach, teamSelection])

    return (
        <Box sx={{ backgroundColor: '#F8F8F8' }}>

            {gameList && gameList.map((gameData, index) => (

                <Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', gap: '18px', b0orderRadius: '10px', margin: '0 24px 24px', height: 'auto', '&:hover': { boxShadow: 3 } }} key={index}>
                    <Box>
                        <img style={{
                            width: '174px',
                            height: '100px',
                            borderRadius: '15px'
                        }} src={gameData.image ? gameData.image : GameImage} alt="" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                        <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px' }}>{getActualGameDate(gameData.date)}</span>

                        <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', position: 'absolute', marginLeft: '100px' }}>{gameData.league_name}</span>
                        <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', position: 'absolute', marginLeft: '300px' }}>{gameData.season_name}</span>

                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src={gameData.home_team_image ? gameData.home_team_image : TeamImage} alt="" />
                            <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.home_team_name}</label>
                        </Box>
                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src={gameData.away_team_image ? gameData.away_team_image : TeamImage} alt="" />
                            <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.away_team_name}</label>
                        </Box>
                    </Box>
                    <Box sx={{ 'svg path': { fill: 'black' } }}>
                        <MenuIcon sx={{ cursor: 'pointer', display: 'block', position: 'absolute', right: '8rem' }} onClick={(e) => {
                            openMenu(e)
                            downloadXML(gameData)
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

                            <MenuItem onClick={() => {
                                setExportXML(true)
                                handleClose()
                            }} value="2"><DownloadIcon />Export to Sportgate</MenuItem>

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
                    team={allTagList}
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