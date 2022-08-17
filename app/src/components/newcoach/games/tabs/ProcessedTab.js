import React, { useEffect, useState } from 'react'
import {
    Box, Menu, MenuItem
} from '@mui/material'
import GameImage from '../../../../assets/game_image.png'
import TeamImage from '../../../../assets/logoAlone.png'
import MenuIcon from '@mui/icons-material/MenuOutlined';
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import SportCodeButton from '../../../coach/SportCodeButton';

const ProcessedTab = ({ allGamesList, game, allTagList, teamId, playerList, playersInGameList }) => {

    let processedGamesList = []
    const [gamesByCoach, setGamesByCoach] = useState()
    const [anchorEl, setanchorEl] = useState(null)

    useEffect(() => {
        allGamesList.map(data => {
            if (data.video_url !== "NO VIDEO") {
                processedGamesList.push(data)
            }
            setGamesByCoach({ ...gamesByCoach, processedGamesList })
        })
    }, [allGamesList])

    // console.log('games : ', allGamesList)
    // console.log(game, allTagList, teamId, playerList, playersInGameList)

    const getActualGameDate = (gameDate) => {
        const getActualDate = new Date(gameDate)
        const date = getActualDate.getDate()
        const month = getActualDate.getMonth() + 1
        const year = getActualDate.getFullYear()
        return date + '/' + month + '/' + year
    }

    const handleClose = (event) => {
        // let value = event.target.value
        // if (value === 2) {
        //     return (
        //         <SportCodeButton
        //             game={game}
        //             team={allTagList}
        //             teamId={teamId}
        //             playerList={playerList}
        //             playersInGameList={playersInGameList}
        //         />
        //     )
        // }
        setanchorEl(null)
    }

    const openMenu = (event) => {
        setanchorEl(event.currentTarget)
    }

    const downloadXML = (game) => {
        // console.log('game : ', game)
    }

    return (
        <Box sx={{ backgroundColor: '#F8F8F8' }}>
            {gamesByCoach && gamesByCoach?.processedGamesList?.map((gameData, index) => (

                <Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', gap: '18px', borderRadius: '10px', margin: '0 24px 24px', height: 'auto', '&:hover': { boxShadow: 3 } }} key={index}>
                    <Box>
                        <img style={{
                            width: '174px',
                            height: '108px',
                            borderRadius: '15px'
                        }} src={gameData.image ? gameData.image : GameImage} alt="" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                        <MenuIcon sx={{ cursor: 'pointer', position: 'absolute', right: '4rem', display: 'block' }} onClick={openMenu} />

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
                            <MenuItem onClick={() => { downloadXML(gameData.id) }} value="2"><DownloadIcon />Export to Sportgate </MenuItem>
                            <hr style={{ margin: '1px' }} />
                            <MenuItem onClick={handleClose} value="3"><DownloadIcon /> Export to Excel</MenuItem>

                        </Menu>

                    </Box>
                </Box>
            ))
            }
        </Box>

    )
}

export default ProcessedTab