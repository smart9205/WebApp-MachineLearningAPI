import React, { useEffect, useReducer } from "react";
import { Button } from '@mui/material'
import { toXML } from 'jstoxml'
import { redColor, greenColor } from "./Colors";

const SportCodeButton = ({ game, t, team, teamId, playerList, playersInGameList, ...rest }) => {

    let GoalkeeperId = []

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

    const playerData = sortedPlayerData.map(data => ({
        instance: {
            ID: data.id,
            start: convertionIntoNumber(data.start_time),
            end: convertionIntoNumber(data.end_time) + 5,
            code: data.player_fname + " " + data.player_lname,
            label: {
                text: data.action_name + " - " + data.action_type_name + " - " + data.action_result_name
            },
        },
    }))

    let sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId)
    let BuildUpGoalkeeperData = []
    let OpponentBuildUpGoalkeeperData = []
    let BuildUpDefensiveHalfSellectedTeam = []
    let BuildUpDefensiveHalfOpponentTeam = []
    let BuildUpOfensiveHalfSellectedTeam = []
    let BuildUpOfensiveHalfOpponentTeam = []
    let prevTeamValue = []
    let rowsForXML = []
    let selectedTeamID = parseInt(teamId)

    const teamData = sortedByTeamTagId.map((data, index, arr) => {

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

        let prevValue = arr[index - 1]

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (!GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.court_area_id === 3 || data.court_area_id === 4) {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpDefensiveHalfSellectedTeam.push(data)
                    } else {
                        prevTeamValue.push(data)
                    }
                } else {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpOfensiveHalfSellectedTeam.push(data)
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
    })

    let random_index_red_color = Math.floor(Math.random() * redColor.length);
    let random_index_green_color = Math.floor(Math.random() * greenColor.length);

    const BuildUpGoalKeeperDataForXML = BuildUpGoalkeeperData.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Build Up - Goalkeeper',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Goalkeeper',
                R: greenColor[random_index_green_color].r,
                G: greenColor[random_index_green_color].g,
                B: greenColor[random_index_green_color].b
            }
        })
        return XMLdata

    })

    const OpponentBuildUpGoalKeeperDataForXML = OpponentBuildUpGoalkeeperData.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Build Up - Goalkeeper',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Goalkeeper',
                R: redColor[random_index_red_color].r,
                G: redColor[random_index_red_color].g,
                B: redColor[random_index_red_color].b
            }
        })
        return XMLdata
    })

    const BuildUpDefensiveHalfSellectedTeamDataForXML = BuildUpDefensiveHalfSellectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Build Up - Defensive Half',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Defensive Half',
                R: greenColor[random_index_green_color].r,
                G: greenColor[random_index_green_color].g,
                B: greenColor[random_index_green_color].b
            }
        })
        return XMLdata
    })

    const BuildUpDefensiveHalfOpponentTeamDataFoxXML = BuildUpDefensiveHalfOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Build Up - Defensive Half',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Defensive Half',
                R: redColor[random_index_red_color].r,
                G: redColor[random_index_red_color].g,
                B: redColor[random_index_red_color].b
            }
        })
        return XMLdata
    })

    const BuildUpOfensiveHalfSellectedTeamDataForXML = BuildUpOfensiveHalfSellectedTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Build Up - Offensive Half',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Build Up - Offensive Half',
                R: greenColor[random_index_green_color].r,
                G: greenColor[random_index_green_color].g,
                B: greenColor[random_index_green_color].b
            }
        })
        return XMLdata
    })

    const BuildUpOfensiveHalfOpponentTeamDataForXML = BuildUpOfensiveHalfOpponentTeam.map(data => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Build Up - Offensive Half',
                label: {
                    text: data.action_type_name
                },
            },
        }
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Offensive Half',
                R: redColor[random_index_red_color].r,
                G: redColor[random_index_red_color].g,
                B: redColor[random_index_red_color].b
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
                BuildUpGoalKeeperDataForXML,
                OpponentBuildUpGoalKeeperDataForXML,
                BuildUpDefensiveHalfSellectedTeamDataForXML,
                BuildUpDefensiveHalfOpponentTeamDataFoxXML,
                BuildUpOfensiveHalfSellectedTeamDataForXML,
                BuildUpOfensiveHalfOpponentTeamDataForXML,
                playerData
            },
            "ROWS": {
                rowDataForXML
            }
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