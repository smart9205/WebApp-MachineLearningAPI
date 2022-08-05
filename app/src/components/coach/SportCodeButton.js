import React, { useEffect } from "react";
import { Button } from '@mui/material'
import { toXML } from 'jstoxml'

const SportCodeButton = ({ game, t, team, playerList, playersInGameList, ...rest }) => {

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

    // console.log('GoalkeeperId : ', GoalkeeperId)

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
            end: convertionIntoNumber(data.end_time),
            code: data.player_fname + " " + data.player_lname,
            label: {
                group: 'PLAYERS',
                text: data.action_name + " - " + data.action_type_name + " - " + data.action_result_name
            },
        },
    }))

    let sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId)
    let BuildUpGoalkeeperData = []
    let OpponentBuildUpGoalkeeperData = []

    const teamData = sortedByTeamTagId.map(data => {
        if (Object.values(GoalkeeperId).includes(parseInt(data.player_id))) {
            if (data.action_id === 2 || data.action_id === 1) {
                // SortedGoalkeeperData.push(data)
                if (data.team_id === data.offensive_team_id) {
                    BuildUpGoalkeeperData.push(data)
                } else OpponentBuildUpGoalkeeperData.push(data)
            }
        }
        // {
        //     instance: {
        //         ID: data.team_tag_id,
        //         start: data.t_start_time,
        //         end: data.t_end_time,
        //         code: data.action_name,
        //         label: {
        //             text: data.action_result_name
        //         },
        //     },
        // }

    })

    // console.log('BuildUpGoalkeeperData : ', BuildUpGoalkeeperData)
    // console.log('OpponentBuildUpGoalkeeperData : ', OpponentBuildUpGoalkeeperData)

    const XMLData =
    {
        "file": {
            "SESSION_INFO": {
                "start_time": game.date
            },
            "SORT_INFO": {
                "sort_type": 'color'
            },
            "ALL_INSTANCES": playerData,
            "ROWS": teamData
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