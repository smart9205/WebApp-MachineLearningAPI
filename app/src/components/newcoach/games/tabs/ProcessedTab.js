import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import GameImage from '../../../../assets/game_image.png'

const ProcessedTab = ({ allGamesList }) => {

    let processedGamesList = []
    const [gamesByCoach, setGamesByCoach] = useState()

    useEffect(() => {
        allGamesList.map(data => {
            if (data.video_url !== "NO VIDEO") {
                processedGamesList.push(data)
            }
            setGamesByCoach({ ...gamesByCoach, processedGamesList })
        })
    }, [allGamesList])

    console.log(gamesByCoach?.processedGamesList)

    const getActualGameDate = (gameDate) => {
        const getActualDate = new Date(gameDate)
        const date = getActualDate.getDate()
        const month = getActualDate.getMonth() + 1
        const year = getActualDate.getFullYear()
        return date + '/' + month + '/' + year
    }

    return (
        <>
            {gamesByCoach && gamesByCoach?.processedGamesList?.map((gameData, index) => (

                <Box Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', height: 'auto' }} key={index}>
                    <Box>
                        <img style={{
                            width: '192px',
                            height: '108px',
                            borderRadius: '15px'
                        }} src={gameData.image ? gameData.image : GameImage} alt="" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ color: 'rgb(165, 165, 168)', fontFamily: 'sans-serif', fontSize: '12px' }}>{getActualGameDate(gameData.date)}</span>
                        <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'bold', position: 'absolute', marginLeft: '100px' }}>{gameData.league_name}</span>
                        <span style={{ color: 'black', fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'bold', position: 'absolute', right: '4rem' }}>{gameData.season_name}</span>
                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src="https://api.static.newstream.ai/media/common/team/273eb4dd-f259-4ea9-8acb-13596937e0fd./tmp/tmpxihzjlb7.40x40_q85_crop.jpg" alt="" />
                            <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.home_team_name}</label>
                        </Box>
                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src="https://api.static.newstream.ai/media/common/team/3bf65ce1-5b4c-41cb-9b6c-7596f2e5ec15./tmp/tmpn7v4yurf.40x40_q85_crop.jpg" alt="" />
                            <label style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.away_team_name}</label>
                        </Box>
                    </Box>
                </Box>
            ))
            }

        </>
    )
}

export default ProcessedTab