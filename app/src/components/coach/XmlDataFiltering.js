import React, { useEffect } from 'react';
import { toXML } from 'jstoxml';
import DownloadXML from './DownloadXML';
import { redColor, greenColor } from './Colors';

const XmlDataFiltering = ({ game, team, teamId, playersInGameList, setExportXML }) => {
    let GoalkeeperId = [];

    let rowsForXML = [];

    let SelectedTeamPlayers = [];
    let OpponentTeamPlayers = [];

    let totalPlayer = [];

    let HomeTeamPlayersID = [];
    let AwayTeamPlayersID = [];

    let selectedTeamID = parseInt(teamId);

    let HomeTeam = 0;
    let AwayTeam = 0;

    playersInGameList.home_team.map((data) => {
        if (data.position === 16) {
            GoalkeeperId.push(data.id);
        }
        if (data.player_id) {
            HomeTeamPlayersID.push(data.player_id);
        }
        if (data.team_id) {
            HomeTeam = data.team_id;
        }
        return;
    });

    playersInGameList.away_team.map((data) => {
        if (data.position === 16) {
            GoalkeeperId.push(data.id);
        }
        if (data.player_id) {
            AwayTeamPlayersID.push(data.player_id);
        }
        if (data.team_id) {
            AwayTeam = data.team_id;
        }
        return;
    });

    const convertionIntoNumber = (numberTime) => {
        let array = numberTime.split(':');
        let hour = parseInt(array[0], 10) * 3600;
        let minute = parseInt(array[1], 10) * 60;
        let seconds = parseInt(array[2], 10);
        return hour + minute + seconds;
    };

    const sortByTeamId = (x, y) => {
        return x.team_id - y.team_id;
    };

    const sortByTeamTagId = (x, y) => {
        return x.team_tag_id - y.team_tag_id;
    };

    const sortByPlayerId = (x, y) => {
        return x.player_id - y.player_id;
    };

    const sortByStartTime = (x, y) => {
        return convertionIntoNumber(x.start_time) - convertionIntoNumber(y.start_time);
    };

    let sortedStartTime = team.sort(sortByStartTime);
    let sortedPlayerId = sortedStartTime.sort(sortByPlayerId);
    let sortedPlayerData = sortedPlayerId.sort(sortByTeamId);

    const playerData = sortedPlayerData.map((data) => {
        totalPlayer.push(data);

        if (selectedTeamID === HomeTeam && HomeTeamPlayersID.includes(parseInt(data.player_id))) {
            SelectedTeamPlayers.push(data);
        } else if (selectedTeamID === AwayTeam && AwayTeamPlayersID.includes(parseInt(data.player_id))) {
            SelectedTeamPlayers.push(data);
        } else {
            OpponentTeamPlayers.push(data);
        }
    });

    let sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId);

    let Offense = [];
    let Defense = [];

    let BuildUpGoalkeeperData = [];
    let OpponentBuildUpGoalkeeperData = [];

    let BuildUpDefensiveHalfSelectedTeam = [];
    let BuildUpDefensiveHalfOpponentTeam = [];

    let BuildUpOfensiveHalfSelectedTeam = [];
    let BuildUpOfensiveHalfOpponentTeam = [];

    let BuildUpDefenseToOffenseSelectedTeam = [];
    let BuildUpDefenseToOffenseOpponentTeam = [];

    let GoalsSelectedTeam = [];
    let GoalsOpponentTeam = [];

    let CrossesSelectedTeam = [];
    let CrossesOpponentTeam = [];

    let FreeKicksSelectedTeam = [];
    let FreeKicksOpponentTeam = [];

    let ShotsOnTargetSelectedTeam = [];
    let ShotsOnTargetOpponnetTeam = [];

    let ShotsOfTargetSelectedTeam = [];
    let ShotsOfTargetOpponnetTeam = [];

    let prevTeamValue = [];
    let lastActionID = 0;
    let testArray = [];

    const teamData = sortedByTeamTagId.map((data, index, arr) => {
        let prevValue = arr[index - 1]; //it will give prev data

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            testArray.push(data);
            if (
                data.action_id !== 5 &&
                data.action_id !== 7 &&
                data.action_id !== 8 &&
                data.action_id !== 10 &&
                data.action_id !== 11 &&
                data.action_id !== 12 &&
                data.action_id !== 13 &&
                data.action_id !== 14 &&
                data.action_result_id !== 4 &&
                data.action_result_id !== 9 &&
                data.action_result_id !== 13 &&
                data.action_result_id !== 17 &&
                data.action_result_id !== 18
            ) {
                Offense.push(data);
            }
        } else {
            if (
                data.action_id !== 5 &&
                data.action_id !== 7 &&
                data.action_id !== 8 &&
                data.action_id !== 10 &&
                data.action_id !== 11 &&
                data.action_id !== 12 &&
                data.action_id !== 13 &&
                data.action_id !== 14 &&
                data.action_result_id !== 4 &&
                data.action_result_id !== 9 &&
                data.action_result_id !== 13 &&
                data.action_result_id !== 17 &&
                data.action_result_id !== 18
            ) {
                Defense.push(data);
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id === 1 && data.action_result_id === 1) {
                ShotsOnTargetSelectedTeam.push(data);
            }
        } else {
            if (data.action_id === 1 && data.action_result_id === 1) {
                ShotsOnTargetOpponnetTeam.push(data);
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id === 1 && data.action_result_id === 2) {
                ShotsOfTargetSelectedTeam.push(data);
            }
        } else {
            if (data.action_id === 1 && data.action_result_id === 2) {
                ShotsOfTargetOpponnetTeam.push(data);
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.action_id === 2 || data.action_id === 1) {
                    BuildUpGoalkeeperData.push(data);
                }
            }
        } else {
            if (GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.action_id === 2 || data.action_id === 1) {
                    OpponentBuildUpGoalkeeperData.push(data);
                }
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (!GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.court_area_id === 3 || data.court_area_id === 4) {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpDefensiveHalfSelectedTeam.push(data);
                    } else {
                        prevTeamValue.push(data);
                    }
                } else {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpOfensiveHalfSelectedTeam.push(data);
                    } else {
                        prevTeamValue.push(data);
                    }
                }
            }
        } else {
            if (!GoalkeeperId.includes(parseInt(data.player_id))) {
                if (data.court_area_id === 3 || data.court_area_id === 4) {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpDefensiveHalfOpponentTeam.push(data);
                    } else {
                        prevTeamValue.push(data);
                    }
                } else {
                    if (prevValue?.team_tag_id !== data.team_tag_id) {
                        BuildUpOfensiveHalfOpponentTeam.push(data);
                    } else {
                        prevTeamValue.push(data);
                    }
                }
            }
        }

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (
                ((lastActionID === 10 || lastActionID === 12 || lastActionID === 7) && data.action_id === 4 && data.action_result_id === 4) ||
                (data.action_id === 2 && (data.action_type_id === 6 || data.action_type_id === 7) && data.action_result_id === 4)
            ) {
                BuildUpDefenseToOffenseSelectedTeam.push(data);
            }
        } else {
            if (
                ((lastActionID === 10 || lastActionID === 12 || lastActionID === 7) && data.action_id === 4 && data.action_result_id === 4) ||
                (data.action_id === 2 && (data.action_type_id === 6 || data.action_type_id === 7) && data.action_result_id === 4)
            ) {
                BuildUpDefenseToOffenseOpponentTeam.push(data);
            }
        }

        lastActionID = data.action_id;

        if (selectedTeamID === parseInt(data.offensive_team_id)) {
            if (data.action_id === 1 && data.action_result_id === 3) {
                GoalsSelectedTeam.push(data);
            }

            if (data.action_id === 3) {
                CrossesSelectedTeam.push(data);
            }

            if (data.action_id === 1 && (data.action_type_id === 11 || data.action_type_id === 13)) {
                FreeKicksSelectedTeam.push(data);
            }
        } else {
            if (data.action_id === 1 && data.action_result_id === 3) {
                GoalsOpponentTeam.push(data);
            }

            if (data.action_id === 3) {
                CrossesOpponentTeam.push(data);
            }

            if (data.action_id === 1 && (data.action_type_id === 11 || data.action_type_id === 13)) {
                FreeKicksOpponentTeam.push(data);
            }
        }
    });

    let label = '';
    const OffenseDataForXML = Offense.map((data) => {
        if (data.action_result_id === 11) {
            label = 'Turnover' + ' - ' + data.action_result_name;
        } else if (data.action_result_id === 3) {
            label = data.action_result_name;
        } else if (data.action_result_id === 15) {
            label = 'Turnover' + ' - ' + data.action_result_name;
        } else if (data.action_id === 4 && data.action_result_id === 10) {
            label = 'Turnover' + ' - ' + data.action_result_name + ' ' + data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_result_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Offense',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Offense',
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        });

        return XMLdata;
    });

    const DefenseDataForXML = Defense.map((data) => {
        if (data.action_result_id === 11) {
            label = 'Turnover' + ' - ' + data.action_result_name;
        } else if (data.action_result_id === 3) {
            label = data.action_result_name;
        } else if (data.action_result_id === 15) {
            label = 'Turnover' + ' - ' + data.action_result_name;
        } else if (data.action_id === 4 && data.action_result_id === 10) {
            label = 'Turnover' + ' - ' + data.action_result_name + ' ' + data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_result_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponents Offense',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponents Offense',
                R: redColor[0].r,
                G: redColor[0].g,
                B: redColor[0].b
            }
        });

        return XMLdata;
    });

    const BuildUpGoalKeeperDataForXML = BuildUpGoalkeeperData.map((data) => {
        if (data.action_id === 2) {
            label = data.action_type_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Goalkeeper',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Build Up - Goalkeeper',
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        });

        return XMLdata;
    });

    const OpponentBuildUpGoalKeeperDataForXML = OpponentBuildUpGoalkeeperData.map((data) => {
        if (data.action_id === 2) {
            label = data.action_type_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Goalkeeper',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Goalkeeper',
                R: redColor[0].r,
                G: redColor[0].g,
                B: redColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpDefensiveHalfSelectedTeamDataForXML = BuildUpDefensiveHalfSelectedTeam.map((data) => {
        if (data.action_id === 4 || data.action_id === 10 || data.action_id === 12) {
            label = data.action_name;
        } else if (data.action_type_id === 4 || data.action_type_id === 5 || data.action_type_id === 6 || data.action_type_id === 7 || data.action_type_id === 11 || data.action_type_id === 14) {
            label = data.action_type_name;
        } else if (data.action_type_id === 8) {
            label = data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Defensive Half',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Build Up - Defensive Half',
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpDefensiveHalfOpponentTeamDataFoxXML = BuildUpDefensiveHalfOpponentTeam.map((data) => {
        if (data.action_id === 3 || data.action_id === 4 || data.action_id === 10 || data.action_id === 12) {
            label = data.action_name;
        } else if (data.action_type_id === 4 || data.action_type_id === 5 || data.action_type_id === 6 || data.action_type_id === 7 || data.action_type_id === 11 || data.action_type_id === 14) {
            label = data.action_type_name;
        } else if (data.action_type_id === 8) {
            label = data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Defensive Half',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Defensive Half',
                R: redColor[0].r,
                G: redColor[0].g,
                B: redColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpOfensiveHalfSelectedTeamDataForXML = BuildUpOfensiveHalfSelectedTeam.map((data) => {
        if (data.action_id === 3 || data.action_id === 4 || data.action_id === 10 || data.action_id === 12) {
            label = data.action_name;
        } else if (data.action_type_id === 4 || data.action_type_id === 5 || data.action_type_id === 6 || data.action_type_id === 7 || data.action_type_id === 11 || data.action_type_id === 14) {
            label = data.action_type_name;
        } else if (data.action_type_id === 8) {
            label = data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Offensive Half',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Build Up - Offensive Half',
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpOfensiveHalfOpponentTeamDataForXML = BuildUpOfensiveHalfOpponentTeam.map((data) => {
        if (data.action_id === 3 || data.action_id === 4 || data.action_id === 10 || data.action_id === 12) {
            label = data.action_name;
        } else if (data.action_type_id === 4 || data.action_type_id === 5 || data.action_type_id === 6 || data.action_type_id === 7 || data.action_type_id === 11 || data.action_type_id === 14) {
            label = data.action_type_name;
        } else if (data.action_type_id === 8) {
            label = data.action_name;
        } else {
            label = data.action_name + ' - ' + data.action_type_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Offensive Half',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Offensive Half',
                R: redColor[0].r,
                G: redColor[0].g,
                B: redColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpDefenseToOffenseSelectedTeamDataForXML = BuildUpDefenseToOffenseSelectedTeam.map((data) => {
        if (data.action_id === 2) {
            label = data.action_type_name;
        } else if (data.action_id === 4) {
            label = data.action_name;
        } else {
            label = data.action_name + ' ' + data.action_type_name + ' ' + data.action_result_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Build Up - Defense To Offense',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Build Up - Defense To Offense',
                R: greenColor[0].r,
                G: greenColor[0].g,
                B: greenColor[0].b
            }
        });
        return XMLdata;
    });

    const BuildUpDefenseToOffenseOpponentTeamDataForXML = BuildUpDefenseToOffenseOpponentTeam.map((data) => {
        if (data.action_id === 2) {
            label = data.action_type_name;
        } else if (data.action_id === 4) {
            label = data.action_name;
        } else {
            label = data.action_name + ' ' + data.action_type_name + ' ' + data.action_result_name;
        }
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.t_start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Build Up - Defense To Offense',
                label: {
                    text: label
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Build Up - Defense To Offense',
                R: redColor[0].r,
                G: redColor[0].g,
                B: redColor[0].b
            }
        });
        return XMLdata;
    });

    const GoalsSelectedTeamDataForXML = GoalsSelectedTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Goals',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Goals',
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
            }
        });
        return XMLdata;
    });

    const GoalsOpponentTeamDataForXML = GoalsOpponentTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Goals',
                label: {
                    //text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Goals',
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });
        return XMLdata;
    });

    const CrossesSelectedTeamDataForXML = CrossesSelectedTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Crosses',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Crosses',
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
            }
        });
        return XMLdata;
    });

    const CrossesOpponentTeamDataForXML = CrossesOpponentTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Crosses',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Crosses',
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });
        return XMLdata;
    });

    const FreeKicksSelectedTeamDataForXML = FreeKicksSelectedTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Free Kicks',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Free Kicks',
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
            }
        });
        return XMLdata;
    });

    const FreeKicksOpponentTeamDataForXML = FreeKicksOpponentTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.t_start_time) - 5,
                end: convertionIntoNumber(data.t_end_time) + 5,
                code: 'Opponent Free Kicks',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Free Kicks',
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });
        return XMLdata;
    });

    const ShotsOnTargetSelectedTeamDataForXML = ShotsOnTargetSelectedTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Shots On Target',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Shots On Target',
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
            }
        });

        return XMLdata;
    });

    const ShotsOnTargetOpponnetTeamDataForXML = ShotsOnTargetOpponnetTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Shots On Target',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Shots On Target',
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });

        return XMLdata;
    });

    const ShotsOfTargetSelectedTeamDataForXML = ShotsOfTargetSelectedTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Shots Of Target',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Shots Of Target',
                R: greenColor[1].r,
                G: greenColor[1].g,
                B: greenColor[1].b
            }
        });

        return XMLdata;
    });

    const ShotsOfTargetOpponnetTeamDataForXML = ShotsOfTargetOpponnetTeam.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.t_end_time),
                code: 'Opponent Shots Of Target',
                label: {
                    // text: data.player_fname + ' ' + data.player_lname + ' - ' + data.action_name + ' - ' + data.action_result_name
                    text: data.player_fname + ' ' + data.player_lname
                }
            }
        };
        rowsForXML.push({
            row: {
                code: 'Opponent Shots Of Target',
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });

        return XMLdata;
    });

    const SelectedTeamPlayersDataForXML = SelectedTeamPlayers.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.end_time),
                code: data.player_fname + ' ' + data.player_lname,
                label: {
                    // text: data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.action_name
                }
            }
        };
        rowsForXML.push({
            row: {
                code: data.player_fname + ' ' + data.player_lname,
                R: greenColor[2].r,
                G: greenColor[2].g,
                B: greenColor[2].b
            }
        });

        return XMLdata;
    });

    const OpponentTeamPlayersDataForXML = OpponentTeamPlayers.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.id,
                start: convertionIntoNumber(data.start_time),
                end: convertionIntoNumber(data.end_time),
                code: data.player_fname + ' ' + data.player_lname,
                label: {
                    // text: data.action_name + ' - ' + data.action_type_name + ' - ' + data.action_result_name
                    text: data.action_name
                }
            }
        };
        rowsForXML.push({
            row: {
                code: data.player_fname + ' ' + data.player_lname,
                R: redColor[1].r,
                G: redColor[1].g,
                B: redColor[1].b
            }
        });

        return XMLdata;
    });

    const rowDataForXML = rowsForXML.filter((value, index, self) => index === self.findIndex((t) => t.row.code === value.row.code));

    const XMLData = {
        file: {
            SESSION_INFO: {
                start_time: game.date
            },
            ALL_INSTANCES: {
                OffenseDataForXML,
                BuildUpGoalKeeperDataForXML,
                BuildUpDefensiveHalfSelectedTeamDataForXML,
                BuildUpOfensiveHalfSelectedTeamDataForXML,
                BuildUpDefenseToOffenseSelectedTeamDataForXML,
                GoalsSelectedTeamDataForXML,
                CrossesSelectedTeamDataForXML,
                FreeKicksSelectedTeamDataForXML,
                ShotsOnTargetSelectedTeamDataForXML,
                ShotsOfTargetSelectedTeamDataForXML,
                SelectedTeamPlayersDataForXML,

                DefenseDataForXML,
                OpponentBuildUpGoalKeeperDataForXML,
                BuildUpDefensiveHalfOpponentTeamDataFoxXML,
                BuildUpOfensiveHalfOpponentTeamDataForXML,
                BuildUpDefenseToOffenseOpponentTeamDataForXML,
                GoalsOpponentTeamDataForXML,
                CrossesOpponentTeamDataForXML,
                FreeKicksOpponentTeamDataForXML,
                ShotsOnTargetOpponnetTeamDataForXML,
                ShotsOfTargetOpponnetTeamDataForXML,
                OpponentTeamPlayersDataForXML
                // playerData
            },
            ROWS: rowDataForXML
        }
    };

    const config = {
        indent: ' '
    };

    const newXMLData = toXML(XMLData, config);
    const blob = new Blob([newXMLData], { type: 'text/xml' });

    useEffect(() => {
        setExportXML(false);
    }, []);

    return <DownloadXML blob={blob} game={game} />;
};

export default XmlDataFiltering;
