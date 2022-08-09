import React, { useEffect, useReducer } from "react";
import { Button } from '@mui/material'
import { toXML } from 'jstoxml'
import { redColor, greenColor } from "./Colors";

const SportCodeButton = ({ game, t, team, teamId, playerList, playersInGameList, ...rest }) => {


    let GoalkeeperId = []
    let greenIndex = 3
    let redIndex = 3
    let rowsForXML = []
    let playerNames = []
    let selectedTeamID = parseInt(teamId)

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

    const playerData = sortedPlayerData.map(( data, key) => {
        
        if(!playerNames.includes(data.player_fname + " " + data.player_lname)) {
            playerNames.push(data.player_fname + " " + data.player_lname)

            
            if(data.offensive_team_id === selectedTeamID){
                var playerRow = rowsForXML.push({
                    row: {
                        code: data.player_fname + " " + data.player_lname,
                        R: greenColor[greenIndex].r,
                        G: greenColor[greenIndex].g,
                        B: greenColor[greenIndex].b
                    }
                }) 
                greenIndex = greenIndex + 1 
            }else{
                var playerRow = rowsForXML.push({
                    row: {
                        code: data.player_fname + " " + data.player_lname,
                        R: redColor[redIndex].r,
                        G: redColor[redIndex].g,
                        B: redColor[redIndex].b
                    }
                })
                redIndex = redIndex + 1
            }


            if(redIndex === 30) {
                redIndex = 0;
            }
            if(greenIndex === 30) {
                greenIndex = 0;
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
                },// this is a object s
            }
            

           
        })
});

    let sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId)
    let BuildUpGoalkeeperData = []
    let OpponentBuildUpGoalkeeperData = []
    let BuildUpDefenseToOffenseSelectedTeam = []
    let BuildUpDefenseToOffenseOpponentTeam = []
    let BuildUpDefensiveHalfSelectedTeam = []
    let BuildUpDefensiveHalfOpponentTeam = []
    let BuildUpOfensiveHalfSelectedTeam = [] 
    let BuildUpOfensiveHalfOpponentTeam = [] 
    let prevTeamValue = []
        
    //console.log('SELECTED TEAM ID ====',selectedTeamID)
    console.log('ALL DATA ============',sortedByTeamTagId)

    const teamData = sortedByTeamTagId.map((data, index, arr) => {
        
        if (selectedTeamID === parseInt(data.offensive_team_id)) {
  
            if((data.action_id == 4 && data.action_result_id == 4)|| (data.action_id == 2 && (data.action_type_id == 6 ||  data.action_type_id == 7) && data.action_result_id == 4)){
                BuildUpDefenseToOffenseSelectedTeam.push(data)
            }   
        }else{
            if((data.action_id == 4 && data.action_result_id == 4)|| (data.action_id == 2 && (data.action_type_id == 6 ||  data.action_type_id == 7) && data.action_result_id == 4)){
                BuildUpDefenseToOffenseOpponentTeam.push(data)
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

        let prevValue = arr[index - 1]

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
    })


    console.log('BuildUpDefenseToOffenseSellectedTeam : ', BuildUpDefenseToOffenseSelectedTeam)
    console.log('BuildUpDefenseToOffenseOpponentTeam : ', BuildUpDefenseToOffenseOpponentTeam)

    
    
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
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        }) // should be pushed only one time ok
        
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
                R: redColor[0].r, // these one?no
                G: redColor[0].g,
                B: redColor[0].b
            }
        })
        return XMLdata
    })

    const BuildUpDefensiveHalfSelectedTeamDataForXML = BuildUpDefensiveHalfSelectedTeam.map(data => {
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
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
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
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        })
        return XMLdata
    })

    const BuildUpOfensiveHalfSelectedTeamDataForXML = BuildUpOfensiveHalfSelectedTeam.map(data => {
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
                R: greenColor[2].r,
                G: greenColor[2].g,
                B: greenColor[2].b
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
                R: redColor[2].r,
                G: redColor[2].g,
                B: redColor[2].b
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
                BuildUpDefensiveHalfSelectedTeamDataForXML,
                BuildUpDefensiveHalfOpponentTeamDataFoxXML,
                BuildUpOfensiveHalfSelectedTeamDataForXML,
                BuildUpOfensiveHalfOpponentTeamDataForXML,
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