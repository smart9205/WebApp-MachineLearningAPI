import React, { useEffect, useReducer } from "react";
import { Button } from '@mui/material'
import { toXML } from 'jstoxml'
import { redColor, greenColor } from "./Colors";

const SportCodeButton = ({ game, t, team, teamId, playerList, playersInGameList, ...rest }) => {

    let GoalkeeperId = []
    let greenIndex = 10
    let redIndex = 10
    let rowsForXML = []
    let playerNames = []
    let selectedTeamID = parseInt(teamId)

    let colorMultipleNumber = 257


    playersInGameList.home_team.map(data => {
        if (data.position === 16) {
            GoalkeeperId.push(data.id)
        }
    })

    playersInGameList.away_team.map(data => {
        if (data.position === 16) {
            GoalkeeperId.push(data.id)
        }
    })

    const convertionIntoNumber = (numberTime) => {
        let array = numberTime.split(":")
        let hour = (parseInt(array[0], 10) * 3600)
        let minute = (parseInt(array[1], 10) * 60)
        let seconds = (parseInt(array[2], 10))
        return hour + minute + seconds
    }

    const sortByTeamId = (x, y) => {
        return x.team_id - y.team_id
    }

    const sortByTeamTagId = (x, y) => {
        return x.team_tag_id - y.team_tag_id
    }

    const sortByPlayerId = (x, y) => {
        return x.player_id - y.player_id
    }

    const sortByStartTime = (x, y) => {
        return convertionIntoNumber(x.start_time) - convertionIntoNumber(y.start_time)
    }

    let sortedStartTime = team.sort(sortByStartTime)
    let sortedPlayerId = sortedStartTime.sort(sortByPlayerId)
    let sortedPlayerData = sortedPlayerId.sort(sortByTeamId)

    const playerData = sortedPlayerData.map((data, key) => {

        if (!playerNames.includes(data.player_fname + " " + data.player_lname)) {
            playerNames.push(data.player_fname + " " + data.player_lname)

            if (data.offensive_team_id === selectedTeamID) {
                var playerRow = rowsForXML.push({
                    row: {
                        code: data.player_fname + " " + data.player_lname,
                        R: parseInt(greenColor[greenIndex].r) * colorMultipleNumber, // we need to add this to all okay 
                        G: parseInt(greenColor[greenIndex].g) * colorMultipleNumber,
                        B: parseInt(greenColor[greenIndex].b) * colorMultipleNumber
                    }
                })
                greenIndex = greenIndex + 1
            } else {
                var playerRow = rowsForXML.push({
                    row: {
                        code: data.player_fname + " " + data.player_lname,
                        R: parseInt(redColor[redIndex].r) * colorMultipleNumber,
                        G: parseInt(redColor[redIndex].g) * colorMultipleNumber,
                        B: parseInt(redColor[redIndex].b) * colorMultipleNumber
                    }
                })
                redIndex = redIndex + 1
            }

            if (redIndex === 30) {
                redIndex = 4;
            }
            if (greenIndex === 30) {
                greenIndex = 4;
            }
        }

        return ({
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.end_time) + 5,
                code: data.player_fname + " " + data.player_lname,
                label: {
                    text: data.action_name + " - " + data.action_type_name + " - " + data.action_result_name
                },
            }
        })
    });

    let sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId)

    let Offense = []
    let Defense = []

    let BuildUpGoalkeeperData = []
    let OpponentBuildUpGoalkeeperData = []

    let BuildUpDefensiveHalfSelectedTeam = []
    let BuildUpDefensiveHalfOpponentTeam = []

    let BuildUpOfensiveHalfSelectedTeam = []
    let BuildUpOfensiveHalfOpponentTeam = []

    let BuildUpDefenseToOffenseSelectedTeam = []
    let BuildUpDefenseToOffenseOpponentTeam = []

    let GoalsSelectedTeam = []
    let GoalsOpponentTeam = []

    let CrossesSelectedTeam = []
    let CrossesOpponentTeam = []

    let FreeKicksSelectedTeam = []
    let FreeKicksOpponentTeam = []

    let ShotsOnTargetSelectedTeam = []
    let ShotsOnTargetOpponnetTeam = []

    let ShotsOfTargetSelectedTeam = []
    let ShotsOfTargetOpponnetTeam = []

    let prevTeamValue = []
    let lastActionID = 0
    let testArray = []

    const teamData = sortedByTeamTagId.map((data, index, arr) => {

        let prevValue = arr[index - 1] //it will give prev data

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            testArray.push(data)
            if (data.action_id != 7 && data.action_id != 8 && data.action_id != 11 && data.action_id != 12 && data.action_id != 10 && data.action_result_id != 4 && data.action_result_id != 9 && data.action_result_id != 13 && data.action_result_id != 17 && data.action_result_id != 18) {
                Offense.push(data)
            }
        }
        else {
            if (data.action_id != 7 && data.action_id != 8 && data.action_id != 11 && data.action_id != 12 && data.action_id != 10 && data.action_result_id != 4 && data.action_result_id != 9 && data.action_result_id != 13 && data.action_result_id != 17 && data.action_result_id != 18) {
                Defense.push(data)
            }
        }


        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id == 1 && data.action_result_id == 1) {
                ShotsOnTargetSelectedTeam.push(data)
            }
        } else {
            if (data.action_id == 1 && data.action_result_id == 1) {
                ShotsOnTargetOpponnetTeam.push(data)
            }
        }


        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id == 1 && data.action_result_id == 2) {
                ShotsOfTargetSelectedTeam.push(data)
            }
        } else {
            if (data.action_id == 1 && data.action_result_id == 2) {
                ShotsOfTargetOpponnetTeam.push(data)
            }
        }


        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.action_id === 2 || data.action_id === 1) {
                    BuildUpGoalkeeperData.push(data)
                }
            }
        } else {
            if (GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.action_id === 2 || data.action_id === 1) {
                    OpponentBuildUpGoalkeeperData.push(data)
                }
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (!GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.court_area_id === 3 || data.court_area_id === 4) {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpDefensiveHalfSelectedTeam.push(data)
                    } else {
                        prevTeamValue.push(data)
                    }
                } else {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpOfensiveHalfSelectedTeam.push(data)
                    } else {
                        prevTeamValue.push(data)
                    }
                }
            }
        } else {
            if (!GoalkeeperId.includes(parseInt(data.player_id))) {

                if (data.court_area_id === 3 || data.court_area_id === 4) {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpDefensiveHalfOpponentTeam.push(data)
                    } else {
                        prevTeamValue.push(data)
                    }
                } else {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpOfensiveHalfOpponentTeam.push(data)
                    } else {
                        prevTeamValue.push(data)
                    }
                }
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if ((lastActionID == 10 || lastActionID == 12 || lastActionID == 7) && (data.action_id == 4 && data.action_result_id == 4) || (data.action_id == 2 && (data.action_type_id == 6 || data.action_type_id == 7) && data.action_result_id == 4)) {
                BuildUpDefenseToOffenseSelectedTeam.push(data)
            }
        } else {
            if ((lastActionID == 10 || lastActionID == 12 || lastActionID == 7) && (data.action_id == 4 && data.action_result_id == 4) || (data.action_id == 2 && (data.action_type_id == 6 || data.action_type_id == 7) && data.action_result_id == 4)) {
                BuildUpDefenseToOffenseOpponentTeam.push(data)
            }

        }

        lastActionID = data.action_id

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id == 1 && data.action_result_id == 3) {
                GoalsSelectedTeam.push(data)
            }

            if (data.action_id == 3) {
                CrossesSelectedTeam.push(data)
            }

            if (data.action_id == 1 && (data.action_type_id == 11 || data.action_type_id == 13)) {
                FreeKicksSelectedTeam.push(data)
            }

        } else {
            if (data.action_id == 1 && data.action_result_id == 3) {
                GoalsOpponentTeam.push(data)
            }

            if (data.action_id == 3) {
                CrossesOpponentTeam.push(data)
            }

            if (data.action_id == 1 && (data.action_type_id == 11 || data.action_type_id == 13)) {
                FreeKicksOpponentTeam.push(data)
            }

        }
    })

    console.log('Offense : ', Offense)
    console.log('Defense : ', Defense)
    console.log('Test-Array : ', testArray)

    const OffenseDataForXML = Offense.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Offense',
                label: {
                    text: data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Offense',
                R: parseInt(greenColor[0].r) * colorMultipleNumber,
                G: parseInt(greenColor[0].g) * colorMultipleNumber,
                B: parseInt(greenColor[0].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const DefenseDataForXML = Defense.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponents Offense',
                label: {
                    text: data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponents Offense',
                R: parseInt(redColor[0].r) * colorMultipleNumber,
                G: parseInt(redColor[0].g) * colorMultipleNumber,
                B: parseInt(redColor[0].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const BuildUpGoalKeeperDataForXML = BuildUpGoalkeeperData.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Goalkeeper',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Goalkeeper',
                R: parseInt(greenColor[1].r) * colorMultipleNumber,
                G: parseInt(greenColor[1].g) * colorMultipleNumber,
                B: parseInt(greenColor[1].b) * colorMultipleNumber
            }
        })

        return XMLdata

    })

    const OpponentBuildUpGoalKeeperDataForXML = OpponentBuildUpGoalkeeperData.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Goalkeeper',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Goalkeeper',
                R: parseInt(redColor[1].r) * colorMultipleNumber,
                G: parseInt(redColor[1].g) * colorMultipleNumber,
                B: parseInt(redColor[1].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpDefensiveHalfSelectedTeamDataForXML = BuildUpDefensiveHalfSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Defensive Half',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Defensive Half',
                R: parseInt(greenColor[2].r) * colorMultipleNumber,
                G: parseInt(greenColor[2].g) * colorMultipleNumber,
                B: parseInt(greenColor[2].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpDefensiveHalfOpponentTeamDataFoxXML = BuildUpDefensiveHalfOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Defensive Half',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Defensive Half',
                R: parseInt(redColor[2].r) * colorMultipleNumber,
                G: parseInt(redColor[2].g) * colorMultipleNumber,
                B: parseInt(redColor[2].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpOfensiveHalfSelectedTeamDataForXML = BuildUpOfensiveHalfSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Offensive Half',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Offensive Half',
                R: parseInt(greenColor[3].r) * colorMultipleNumber,
                G: parseInt(greenColor[3].g) * colorMultipleNumber,
                B: parseInt(greenColor[3].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpOfensiveHalfOpponentTeamDataForXML = BuildUpOfensiveHalfOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Offensive Half',
                label: {
                    text: data.action_name + ' - ' + data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Offensive Half',
                R: parseInt(redColor[3].r) * colorMultipleNumber,
                G: parseInt(redColor[3].g) * colorMultipleNumber,
                B: parseInt(redColor[3].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpDefenseToOffenseSelectedTeamDataForXML = BuildUpDefenseToOffenseSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Defense To Offense',
                label: {
                    text: data.action_name + ' ' + data.action_type_name + ' ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Defense To Offense',
                R: parseInt(greenColor[4].r) * colorMultipleNumber,
                G: parseInt(greenColor[4].g) * colorMultipleNumber,
                B: parseInt(greenColor[4].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const BuildUpDefenseToOffenseOpponentTeamDataForXML = BuildUpDefenseToOffenseOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Defense To Offense',
                label: {
                    text: data.action_name + ' ' + data.action_type_name + ' ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Defense To Offense',
                R: parseInt(redColor[4].r) * colorMultipleNumber,
                G: parseInt(redColor[4].g) * colorMultipleNumber,
                B: parseInt(redColor[4].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const GoalsSelectedTeamDataForXML = GoalsSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Goals',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Goals',
                R: parseInt(greenColor[5].r) * colorMultipleNumber,
                G: parseInt(greenColor[5].g) * colorMultipleNumber,
                B: parseInt(greenColor[5].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const GoalsOpponentTeamDataForXML = GoalsOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Goals',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Goals',
                R: parseInt(redColor[5].r) * colorMultipleNumber,
                G: parseInt(redColor[5].g) * colorMultipleNumber,
                B: parseInt(redColor[5].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const CrossesSelectedTeamDataForXML = CrossesSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Crosses',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Crosses',
                R: parseInt(greenColor[6].r) * colorMultipleNumber,
                G: parseInt(greenColor[6].g) * colorMultipleNumber,
                B: parseInt(greenColor[6].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const CrossesOpponentTeamDataForXML = CrossesOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponet Crosses',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Crosses',
                R: parseInt(redColor[6].r) * colorMultipleNumber,
                G: parseInt(redColor[6].g) * colorMultipleNumber,
                B: parseInt(redColor[6].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const FreeKicksSelectedTeamDataForXML = FreeKicksSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Free Kicks',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Free Kicks',
                R: parseInt(greenColor[7].r) * colorMultipleNumber,
                G: parseInt(greenColor[7].g) * colorMultipleNumber,
                B: parseInt(greenColor[7].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const FreeKicksOpponentTeamDataForXML = FreeKicksOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Free Kicks',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Free Kicks',
                R: parseInt(redColor[7].r) * colorMultipleNumber,
                G: parseInt(redColor[7].g) * colorMultipleNumber,
                B: parseInt(redColor[7].b) * colorMultipleNumber
            }
        })
        return XMLdata
    })

    const ShotsOnTargetSelectedTeamDataForXML = ShotsOnTargetSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Shots On Target',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Shots On Target',
                R: parseInt(greenColor[8].r) * colorMultipleNumber,
                G: parseInt(greenColor[8].g) * colorMultipleNumber,
                B: parseInt(greenColor[8].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const ShotsOnTargetOpponnetTeamDataForXML = ShotsOnTargetOpponnetTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Shots On Target',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Shots On Target',
                R: parseInt(redColor[8].r) * colorMultipleNumber,
                G: parseInt(redColor[8].g) * colorMultipleNumber,
                B: parseInt(redColor[8].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const ShotsOfTargetSelectedTeamDataForXML = ShotsOfTargetSelectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Shots Of Target',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Shots Of Target',
                R: parseInt(greenColor[9].r) * colorMultipleNumber,
                G: parseInt(greenColor[9].g) * colorMultipleNumber,
                B: parseInt(greenColor[9].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const ShotsOfTargetOpponnetTeamDataForXML = ShotsOfTargetOpponnetTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Shots Of Target',
                label: {
                    text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Shots Of Target',
                R: parseInt(redColor[9].r) * colorMultipleNumber,
                G: parseInt(redColor[9].g) * colorMultipleNumber,
                B: parseInt(redColor[9].b) * colorMultipleNumber
            }
        })

        return XMLdata
    })

    const rowDataForXML = rowsForXML.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.row.code === value.row.code
        ))
    )

    const XMLData =
    {
        "file": {
            "SESSION_INFO": {
                "start_time": game.date
            },
            "ALL_INSTANCES": {

                OffenseDataForXML,
                DefenseDataForXML,

                BuildUpGoalKeeperDataForXML,
                OpponentBuildUpGoalKeeperDataForXML,

                BuildUpDefensiveHalfSelectedTeamDataForXML,
                BuildUpDefensiveHalfOpponentTeamDataFoxXML,

                BuildUpOfensiveHalfSelectedTeamDataForXML,
                BuildUpOfensiveHalfOpponentTeamDataForXML,

                BuildUpDefenseToOffenseSelectedTeamDataForXML,
                BuildUpDefenseToOffenseOpponentTeamDataForXML,

                GoalsSelectedTeamDataForXML,
                GoalsOpponentTeamDataForXML,

                CrossesSelectedTeamDataForXML,
                CrossesOpponentTeamDataForXML,

                FreeKicksSelectedTeamDataForXML,
                FreeKicksOpponentTeamDataForXML,

                ShotsOnTargetSelectedTeamDataForXML,
                ShotsOnTargetOpponnetTeamDataForXML,

                ShotsOfTargetSelectedTeamDataForXML,
                ShotsOfTargetOpponnetTeamDataForXML,

                playerData
            },
            "ROWS": rowDataForXML
        }
    }

    const config = {
        indent: ' '
    };

    const newXMLData = toXML(XMLData, config)

    const blob = new Blob([newXMLData], { type: 'text/xml' })

    const getActualDate = new Date(game.date)
    const date = getActualDate.getDate()
    const month = getActualDate.getMonth()
    const year = getActualDate.getFullYear()
    const gameDate = '(' + date + '-' + month + '-' + year + ')'

    const downloadXML = () => {
        const fileName = game.home_team_name.split('_').join(' ') + ' vs ' + game.away_team_name + ' ' + gameDate;
        var pom = document.createElement('a');
        pom.setAttribute('href', window.URL.createObjectURL(blob));
        pom.setAttribute('download', fileName);
        pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
        pom.draggable = true;
        pom.classList.add('dragout');
        pom.click();
    }

    return (
        <div {...rest}>
            <Button style={{ fontSize: '11px' }} variant="outlined" onClick={downloadXML}>{t("Export To SportCode")}</Button>
        </div>
    );
}

export default SportCodeButton;