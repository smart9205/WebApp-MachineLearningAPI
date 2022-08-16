import { Box, Typography } from '@mui/material';
import React, { useState, useEffect, useReducer } from 'react'
import ProcessedTab from './tabs/ProcessedTab'
import PendingTab from './tabs/PendingTab'
import gameService from '../../../services/game.service';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Tabs = ['Processed', 'Pending'];

const Games = () => {

    const [curTab, setCurTab] = useState(0);
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        team: null,
        teamList: [],
        game: null,
        gameListByCoach: [],
    })
    const { team, game, gameListByCoach, teamList } = state

    const [updateGamesList, setUpdateGamesList] = useState(false)
    const [period, setPeriod] = React.useState('all');
    const [teamSelection, setTeamSelection] = useState('all')
    const [TeamSelectionOptions, setTeamSelectionOptions] = useState()

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


    let teamSelectionFields = []

    const gettingTeamData = async () => {
        await gameListByCoach.map(teamData => {
            if (teamData?.home_team_id && teamData?.away_team_id) {
                teamSelectionFields.push({
                    value: teamData.home_team_id,
                    label: teamData.home_team_name
                })
                teamSelectionFields.push({
                    value: teamData.away_team_id,
                    label: teamData.away_team_name
                })
            }
        })
    }

    useEffect(() => {
        gettingTeamData()
        setTeamSelectionOptions({ ...TeamSelectionOptions, teamSelectionFields })
    }, [gameListByCoach])

    const handleChange = (event) => {
        setPeriod(event.target.value);
    };

    return (
        <>
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

                        <Box sx={{ display: 'flex', gap: '2rem', marginLeft: '4rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>Period</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={period}
                                        onChange={handleChange}
                                        variant='outlined'
                                        label=''
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ borderRadius: '5px', height: '36px', width: '160px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                                    >
                                        <MenuItem value='all'>All</MenuItem>
                                        <MenuItem value={'last-week'}>Last week</MenuItem>
                                        <MenuItem value={'last-month'}>Last month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 500, color: '#A5A5A8' }}>Team</Typography>
                                <FormControl sx={{ m: 1, minWidth: 120, border: 'none' }}>
                                    <Select
                                        value={teamSelection}
                                        onChange={(e) => setTeamSelection(e.target.value)}
                                        label=''
                                        variant="standard"
                                        disableUnderline
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{ outline: 'none', height: '36px' }}
                                    >
                                        <MenuItem value='all'>All</MenuItem>

                                        {TeamSelectionOptions?.teamSelectionFields && TeamSelectionOptions?.teamSelectionFields?.map((option, index) => (
                                            <MenuItem key={index} value={option.value} >{option.label}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {curTab === 0 && <ProcessedTab allGamesList={gameListByCoach} />}
                {curTab === 1 && <PendingTab allGamesList={gameListByCoach} setUpdateGamesList={setUpdateGamesList} />}

            </Box>
        </>
    )
}

export default Games