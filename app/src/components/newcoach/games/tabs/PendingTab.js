import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import GameImage from '../../../../assets/game_image.png'
import { BootstrapInput, UpdateButton } from '../component';
import gameService from '../../../../services/game.service';

const PendingTab = ({ allGamesList, setUpdateGamesList }) => {

    let pendingGamesList = []
    const [gamesByCoach, setGamesByCoach] = useState()
    const [videoUrl, setVideoUrl] = useState('')

    useEffect(() => {
        allGamesList.map(data => {
            if (data.video_url === "NO VIDEO") {
                pendingGamesList.push(data)
            }
            setGamesByCoach({ ...gamesByCoach, pendingGamesList })
        })
    }, [allGamesList])

    console.log(gamesByCoach?.pendingGamesList)

    const getActualGameDate = (gameDate) => {
        const getActualDate = new Date(gameDate)
        const date = getActualDate.getDate()
        const month = getActualDate.getMonth()
        const year = getActualDate.getFullYear()
        return date + '/' + month + '/' + year
    }

    const handleChange = event => {
        setVideoUrl(event.target.value)
    }

    const handleSubmit = (gameData) => {
        try {
            gameService.updateGame({
                id: gameData?.id,
                image: gameData?.image,
                season_id: gameData?.season_id,
                league_id: gameData?.league_id,
                home_team_id: gameData?.home_team_id,
                away_team_id: gameData?.away_team_time,
                date: gameData?.date,
                video_url: videoUrl,
                mobile_video_url: gameData?.mobile_video_url ? gameData?.mobile_video_url : videoUrl,
                mute_video: gameData?.mute_video
            }).then((res) => {
                setUpdateGamesList(true)
                console.log(res)
            }).catch((e) => { console.log(e) })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            {gamesByCoach && gamesByCoach?.pendingGamesList?.map((gameData, index) => (

                <Box Box sx={{ padding: '10px', backgroundColor: 'white', display: 'flex', gap: '24px', borderRadius: '10px', margin: '0 24px 24px', height: 'auto' }} key={index}>
                    <Box >
                        <img style={{
                            width: '192px',
                            height: '108px',
                            borderRadius: '15px'
                        }} src={gameData.image ? gameData.image : GameImage} alt="" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ color: 'rgb(165, 165, 168)', fontFamily: 'DM Sans', fontSize: '12px' }}>{getActualGameDate(gameData.date)}</span>
                        <span style={{ color: 'black', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 'bold', position: 'absolute', marginLeft: '100px' }}>{gameData.league_name}</span>
                        <span style={{ color: 'black', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 'bold', position: 'absolute', right: '4rem' }}>{gameData.season_name}</span>
                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src="https://api.static.newstream.ai/media/common/team/273eb4dd-f259-4ea9-8acb-13596937e0fd./tmp/tmpxihzjlb7.40x40_q85_crop.jpg" alt="" />
                            <label style={{ color: 'black', fontFamily: 'DM Sans', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.home_team_name}</label>
                        </Box>
                        <Box>
                            <img style={{ borderRadius: '5px', width: '24px' }} src="https://api.static.newstream.ai/media/common/team/3bf65ce1-5b4c-41cb-9b6c-7596f2e5ec15./tmp/tmpn7v4yurf.40x40_q85_crop.jpg" alt="" />
                            <label style={{ color: 'black', fontFamily: 'DM Sans', fontWeight: 'bold', fontSize: '14px', marginLeft: '15px' }}>{gameData.away_team_name}</label>
                        </Box>
                    </Box>
                    <Box>
                        <label style={{ color: 'black', fontSize: '14px', marginLeft: '26px', fontFamily: 'DM Sans', fontWeight: 600 }} >Video URL: </label>
                        <BootstrapInput variant="standard" value={videoUrl} onChange={handleChange} />
                        <UpdateButton onClick={() => handleSubmit(gameData)}>+  Update</UpdateButton>
                    </Box>
                </Box>
            ))
            }

        </>
    )
}

export default PendingTab