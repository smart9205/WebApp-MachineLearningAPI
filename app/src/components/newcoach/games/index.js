import { Box, Typography } from '@mui/material';
import React, { useState, useEffect, useReducer } from 'react'
import ProcessedTab from './tabs/ProcessedTab'
import PendingTab from './tabs/PendingTab'
import gameService from '../../../services/game.service';

const Tabs = ['Processed', 'Pending'];

const Games = () => {

    const [curTab, setCurTab] = useState(0);
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        team: null,
        game: null,
        gameListByCoach: [],
    })
    const { team, game, gameListByCoach } = state

    const [updateGamesList, setUpdateGamesList] = useState(false)

    useEffect(() => {
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] })
        })
    }, [])

    const gettingAllGamesByCoach = () => {
        if (!team) return
        gameService.getAllGamesByCoach(team.user_id).then((res) => {
            setState({ gameListByCoach: res, gameByCoach: res[0] })
        })
    }

    useEffect(() => {
        gettingAllGamesByCoach()
    }, [updateGamesList, team])


    useEffect(() => {
        if (!!team && !!game) {
            gameService.getAllPlayerTagsByTeam(team.team_id, game?.id).then((res) => {
                setState({ allTagList: res })
            })
        } else {
            setState({ allTagList: [] })
        }
    }, [team, game])

    return (
        <Box sx={{ minWidth: '1400px', margin: '0 auto', maxWidth: '1320px' }}>
            <Box sx={{ padding: '24px 24px 21px 48px' }}>
                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '32px', fontWeight: 700, color: '#1a1b1d' }}>Games</Typography>
                <Box sx={{ display: 'flex', marginTop: '24px', alignItems: 'center', gap: '24px' }}>
                    {Tabs.map((title, index) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'fit-content', gap: '4px', cursor: 'pointer', fontFamily: 'sans-serif' }} onClick={() => setCurTab(index)}>
                            <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: curTab === index ? 'black' : '#A5A5A8' }}>{title}</Typography>
                            <Box sx={{ height: '2px', width: '100%', backgroundColor: curTab === index ? 'red' : '#F8F8F8' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
            {curTab === 0 && <ProcessedTab allGamesList={gameListByCoach} />}
            {curTab === 1 && <PendingTab allGamesList={gameListByCoach} setUpdateGamesList={setUpdateGamesList} />}
        </Box>
    )
}

export default Games