import React, { useEffect, useState } from 'react';
import { toXML } from 'jstoxml';

import DownloadXML from '../../coach/DownloadXML';
import { greenColor, redColor } from '../../coach/Colors';
import GameService from '../../../services/game.service';

export const XmlDataFilterGame = ({ game, tagList, isOur, tag_name, setExportXML }) => {
    let rowsForXML = [];

    const convertionIntoNumber = (numberTime) => {
        const array = numberTime.split(':');
        const hour = parseInt(array[0], 10) * 3600;
        const minute = parseInt(array[1], 10) * 60;
        const seconds = parseInt(array[2], 10);

        return hour + minute + seconds;
    };

    const sortByTeamTagId = (x, y) => {
        return x.team_tag_id - y.team_tag_id;
    };

    const sortByStartTime = (x, y) => {
        return convertionIntoNumber(x.team_tag_start_time) - convertionIntoNumber(y.team_tag_start_time);
    };

    const sortedStartTime = tagList.sort(sortByStartTime);
    const sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId);
    let TagDataForXML = [
        {
            instance: {
                ID: 0,
                start: 0,
                end: 10,
                code: 'Begining of Video'
            }
        }
    ];
    const data = sortedByTeamTagId.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.team_tag_start_time) - 5,
                end: convertionIntoNumber(data.team_tag_end_time) + 5,
                code: tag_name,
                label: {
                    text: `${data.action_names} - ${data.action_result_names} - ${data.player_names}`
                }
            }
        };
        rowsForXML.push({
            row: {
                code: tag_name,
                R: isOur ? greenColor[1].r : redColor[1].r,
                G: isOur ? greenColor[1].g : redColor[1].g,
                B: isOur ? greenColor[1].b : redColor[1].b
            }
        });
        return XMLdata;
    });

    TagDataForXML = [...TagDataForXML, ...data];

    const XMLData = {
        file: {
            SESSION_INFO: {
                start_time: game.date
            },
            ALL_INSTANCES: {
                TagDataForXML
            },
            ROWS: rowsForXML
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

export const XmlDataFilterGamePlayer = ({ game, tagList, isOur, tag_name, setExportXML }) => {
    let rowsForXML = [];

    const convertionIntoNumber = (numberTime) => {
        const array = numberTime.split(':');
        const hour = parseInt(array[0], 10) * 3600;
        const minute = parseInt(array[1], 10) * 60;
        const seconds = parseInt(array[2], 10);

        return hour + minute + seconds;
    };

    const sortByTeamTagId = (x, y) => {
        return x.team_tag_id - y.team_tag_id;
    };

    const sortByStartTime = (x, y) => {
        return convertionIntoNumber(x.player_tag_start_time) - convertionIntoNumber(y.player_tag_start_time);
    };

    const sortedStartTime = tagList.sort(sortByStartTime);
    const sortedByTeamTagId = sortedStartTime.sort(sortByTeamTagId);
    let TagDataForXML = [
        {
            instance: {
                ID: 0,
                start: 0,
                end: 10,
                code: 'Begining of Video'
            }
        }
    ];
    const data = sortedByTeamTagId.map((data) => {
        const XMLdata = {
            instance: {
                ID: data.team_tag_id,
                start: convertionIntoNumber(data.player_tag_start_time) - 5,
                end: convertionIntoNumber(data.player_tag_end_time) + 5,
                code: tag_name,
                label: {
                    text: `${data.action_names} - ${data.action_result_names} - ${data.player_names}`
                }
            }
        };
        rowsForXML.push({
            row: {
                code: tag_name,
                R: isOur ? greenColor[1].r : redColor[1].r,
                G: isOur ? greenColor[1].g : redColor[1].g,
                B: isOur ? greenColor[1].b : redColor[1].b
            }
        });
        return XMLdata;
    });

    TagDataForXML = [...TagDataForXML, ...data];

    const XMLData = {
        file: {
            SESSION_INFO: {
                start_time: game.date
            },
            ALL_INSTANCES: {
                TagDataForXML
            },
            ROWS: rowsForXML
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

export const XmlDataFilterGames = ({ game, setXML, setLoading }) => {
    const [newBlob, setNewBlob] = useState(null);
    let allData = [];
    let rowsForXML = [];
    let clipCounter = 0;
    const upperButtons = [
        'Game Highlight',
        'All Offensive Possessions',
        'All Defensive Possessions',
        'Offensive Half Build Up',
        'Defensive Half Build Up',
        "Goalkeeper's Build Up",
        'Started From Goalkeeper',
        'Counter-Attacks',
        'Started From Interception',
        'Started From Tackle',
        'Started From Throw In'
    ];

    const convertToNumber = (numberTime) => {
        const array = numberTime.split(':');
        const hour = parseInt(array[0], 10) * 3600;
        const minute = parseInt(array[1], 10) * 60;
        const seconds = parseInt(array[2], 10);

        return hour + minute + seconds;
    };

    const sortByStartTime = (x, y) => {
        return convertToNumber(x.player_tag_start_time) - convertToNumber(y.player_tag_start_time);
    };

    const getTeamTagList = (name) => {
        const res = allData.filter((item) => item.instance_name === name);

        return res.map((item) => {
            let display = '';
            const compareText = item.instance_name.replace('Opponent ', '');
            const isOur = item.instance_name.includes('Opponent');
            const green_index = upperButtons.includes(compareText) ? 0 : 1;
            const red_index = upperButtons.includes(compareText) ? 0 : 1;
            const filtered = rowsForXML.filter((data) => data.row.code === item.instance_name);

            if (filtered.length === 0) {
                rowsForXML.push({
                    row: {
                        code: item.instance_name,
                        R: !isOur ? greenColor[green_index].r : redColor[red_index].r,
                        G: !isOur ? greenColor[green_index].g : redColor[red_index].g,
                        B: !isOur ? greenColor[green_index].b : redColor[red_index].b
                    }
                });
            }

            if (compareText === "Goalkeeper's Build Up" || compareText === 'Started From Goalkeeper') display = item.action_type_name;
            else if (
                compareText === 'Offensive Half Build Up' ||
                compareText === 'Defensive Half Build Up' ||
                compareText === 'Started From Interception' ||
                compareText === 'Started From Tackle' ||
                compareText === 'Started From Throw In' ||
                compareText === 'Free Kicks' ||
                compareText === 'Crosses' ||
                compareText === 'Corners' ||
                compareText === 'Counter-Attacks' ||
                compareText === 'Penalties Gained' ||
                compareText === 'Goals' ||
                compareText === 'Goal Opportunities' ||
                compareText === 'Goal Kicks' ||
                compareText === 'Offsides' ||
                compareText === 'Turnovers'
            )
                display = item.player_name;
            else display = item.action_name + ' - ' + item.action_result_name;

            clipCounter += 1;

            return compareText === 'All Offensive Possessions' || compareText === 'All Defensive Possessions'
                ? {
                      instance: {
                          ID: clipCounter,
                          start: upperButtons.includes(compareText) ? convertToNumber(item.start_time) : convertToNumber(item.start_time) - 5,
                          end: upperButtons.includes(compareText) ? convertToNumber(item.end_time) : convertToNumber(item.end_time) + 5,
                          code: item.instance_name
                      }
                  }
                : {
                      instance: {
                          ID: clipCounter,
                          start: upperButtons.includes(compareText) ? convertToNumber(item.start_time) : convertToNumber(item.start_time) - 5,
                          end: upperButtons.includes(compareText) ? convertToNumber(item.end_time) : convertToNumber(item.end_time) + 5,
                          code: item.instance_name,
                          label: {
                              text: display
                          }
                      }
                  };
        });
    };

    const getPlayerTagList = async (id, isOur) => {
        return await GameService.getGamePlayerTags(id, null, `${game.id}`, null, null, null).then((res) => {
            const sortedList = res.sort(sortByStartTime);
            let player_names = [];
            let playerActions = [];

            sortedList.map((item) => {
                if (!player_names.includes(item.player_names)) player_names = [...player_names, item.player_names];
            });
            player_names.map((name) => {
                const player_actions = sortedList.filter((tag) => name === tag.player_names);

                rowsForXML.push({
                    row: {
                        code: name,
                        R: isOur ? greenColor[2].r : redColor[1].r,
                        G: isOur ? greenColor[2].g : redColor[1].g,
                        B: isOur ? greenColor[2].b : redColor[1].b
                    }
                });
                player_actions.map((action) => {
                    playerActions.push({
                        instance: {
                            ID: action.team_tag_id,
                            start: convertToNumber(action.player_tag_start_time),
                            end: convertToNumber(action.player_tag_end_time),
                            code: action.player_names,
                            label: {
                                text: action.action_names + ' - ' + action.action_result_names
                            }
                        }
                    });
                });
            });

            return playerActions;
        });
    };

    useEffect(async () => {
        const teamIds = await GameService.getAllMyCoachTeam().then((res) => {
            const filtered = res.filter(
                (item) => item.season_name === game.season_name && item.league_name === game.league_name && (item.team_id === game.home_team_id || item.team_id === game.away_team_id)
            );
            const teamId = filtered[0].team_id;
            const opponentTeamId = teamId === game.home_team_id ? game.away_team_id : game.home_team_id;

            return {
                teamId,
                opponentTeamId
            };
        });

        await GameService.gameExportSportcode(teamIds.teamId, `${game.id}`).then((res) => {
            allData = res;
        });

        console.log(allData);

        const OurGameHighlight = getTeamTagList('Game Highlight');
        const OurCleanGame = getTeamTagList('Clean Game');
        const OurOffensivePossession = getTeamTagList('All Offensive Possessions');
        const OurDefensivePossession = getTeamTagList('All Defensive Possessions');
        const OurOffensiveHalfBuild = getTeamTagList('Offensive Half Build Up');
        const OurDefensiveHalfBuild = getTeamTagList('Defensive Half Build Up');
        const OurGoalkeeperBuild = getTeamTagList("Goalkeeper's Build Up");
        const OurBuildonGoalkeeper = getTeamTagList('Started From Goalkeeper');
        const OurCounterAttacks = getTeamTagList('Counter-Attacks');
        const OurBuildonInterception = getTeamTagList('Started From Interception');
        const OurBuildonTackle = getTeamTagList('Started From Tackle');
        const OurBuildonThrowIn = getTeamTagList('Started From Throw In');
        const OurGoals = getTeamTagList('Goals');
        const OurShots = getTeamTagList('Shots');
        const OurFreeKicks = getTeamTagList('Free Kicks');
        const OurCorners = getTeamTagList('Corners');
        const OurCrosses = getTeamTagList('Crosses');
        const OurDrawFouls = getTeamTagList('Draw Fouls');
        const OurTurnovers = getTeamTagList('Turnovers');
        const OurOffsides = getTeamTagList('Offsides');
        const OurPenalty = getTeamTagList('Penalties Gained');
        const OurSaved = getTeamTagList('Saved');
        const OurBlocked = getTeamTagList('Blocked');
        const OurClearance = getTeamTagList('Clearance');

        const OpponentOffensivePossession = getTeamTagList('Opponent All Offensive Possessions');
        const OpponentDefensivePossession = getTeamTagList('Opponent All Defensive Possessions');
        const OpponentOffensiveHalfBuild = getTeamTagList('Opponent Offensive Half Build Up');
        const OpponentDefensiveHalfBuild = getTeamTagList('Opponent Defensive Half Build Up');
        const OpponentGoalkeeperBuild = getTeamTagList("Opponent Goalkeeper's Build Up");
        const OpponentBuildonGoalkeeper = getTeamTagList('Opponent Started From Goalkeeper');
        const OpponentCounterAttacks = getTeamTagList('Opponent Counter-Attacks');
        const OpponentBuildonInterception = getTeamTagList('Opponent Started From Interception');
        const OpponentBuildonTackle = getTeamTagList('Opponent Started From Tackle');
        const OpponentBuildonThrowIn = getTeamTagList('Opponent Started From Throw In');
        const OpponentGoals = getTeamTagList('Opponent Goals');
        const OpponentShots = getTeamTagList('Opponent Shots');
        const OpponentFreeKicks = getTeamTagList('Opponent Free Kicks');
        const OpponentCorners = getTeamTagList('Opponent Corners');
        const OpponentCrosses = getTeamTagList('Opponent Crosses');
        const OpponentDrawFouls = getTeamTagList('Opponent Draw Fouls');
        const OpponentTurnovers = getTeamTagList('Opponent Turnovers');
        const OpponentOffsides = getTeamTagList('Opponent Offsides');
        const OpponentPenalty = getTeamTagList('Opponent Penalties Gained');
        const OpponentSaved = getTeamTagList('Opponent Saved');
        const OpponentBlocked = getTeamTagList('Opponent Blocked');
        const OpponentClearance = getTeamTagList('Opponent Clearance');

        const OurPlayerTags = await getPlayerTagList(teamIds.teamId, true);
        const OpponentPlayerTags = await getPlayerTagList(teamIds.opponentTeamId, false);

        const XMLData = {
            file: {
                SESSION_INFO: {
                    start_time: game.date
                },
                ALL_INSTANCES: {
                    instance: {
                        ID: 0,
                        start: 0,
                        end: 10,
                        code: 'Begining of Video'
                    },
                    OurGameHighlight,
                    OurCleanGame,
                    OurOffensivePossession,
                    OurDefensivePossession,
                    OurOffensiveHalfBuild,
                    OurDefensiveHalfBuild,
                    OurGoalkeeperBuild,
                    OurBuildonGoalkeeper,
                    OurCounterAttacks,
                    OurBuildonInterception,
                    OurBuildonTackle,
                    OurBuildonThrowIn,
                    OurGoals,
                    OurShots,
                    OurFreeKicks,
                    OurCorners,
                    OurCrosses,
                    OurDrawFouls,
                    OurTurnovers,
                    OurOffsides,
                    OurPenalty,
                    OurSaved,
                    OurBlocked,
                    OurClearance,
                    OurPlayerTags,

                    OpponentOffensivePossession,
                    OpponentDefensivePossession,
                    OpponentOffensiveHalfBuild,
                    OpponentDefensiveHalfBuild,
                    OpponentGoalkeeperBuild,
                    OpponentBuildonGoalkeeper,
                    OpponentCounterAttacks,
                    OpponentBuildonInterception,
                    OpponentBuildonTackle,
                    OpponentBuildonThrowIn,
                    OpponentGoals,
                    OpponentShots,
                    OpponentFreeKicks,
                    OpponentCorners,
                    OpponentCrosses,
                    OpponentDrawFouls,
                    OpponentTurnovers,
                    OpponentOffsides,
                    OpponentPenalty,
                    OpponentSaved,
                    OpponentBlocked,
                    OpponentClearance,
                    OpponentPlayerTags
                },
                ROWS: rowsForXML
            }
        };

        const config = {
            indent: ' '
        };

        const newXMLData = toXML(XMLData, config);
        const blob = new Blob([newXMLData], { type: 'text/xml' });

        console.log(rowsForXML);
        setNewBlob(blob);
        setXML(false);
        setLoading(false);
    }, []);

    return <>{newBlob !== null && <DownloadXML blob={newBlob} game={game} />}</>;
};

export const XmlDataFilterOpponents = ({ game, teamId, setXML, setLoading }) => {
    const [newBlob, setNewBlob] = useState(null);
    let allData = [];
    let rowsForXML = [];
    let clipCounter = 0;
    const upperButtons = [
        'Game Highlight',
        'All Offensive Possessions',
        'All Defensive Possessions',
        'Offensive Half Build Up',
        'Defensive Half Build Up',
        "Goalkeeper's Build Up",
        'Started From Goalkeeper',
        'Counter-Attacks',
        'Started From Interception',
        'Started From Tackle',
        'Started From Throw In'
    ];

    const convertToNumber = (numberTime) => {
        const array = numberTime.split(':');
        const hour = parseInt(array[0], 10) * 3600;
        const minute = parseInt(array[1], 10) * 60;
        const seconds = parseInt(array[2], 10);

        return hour + minute + seconds;
    };

    const sortByStartTime = (x, y) => {
        return convertToNumber(x.player_tag_start_time) - convertToNumber(y.player_tag_start_time);
    };

    const getTeamTagList = (name) => {
        const res = allData.filter((item) => item.instance_name === name);

        return res.map((item) => {
            let display = '';
            const compareText = item.instance_name.replace('Opponent ', '');
            const isOur = item.instance_name.includes('Opponent');
            const green_index = upperButtons.includes(compareText) ? 0 : 1;
            const red_index = upperButtons.includes(compareText) ? 0 : 1;
            const filtered = rowsForXML.filter((data) => data.row.code === item.instance_name);

            if (filtered.length === 0) {
                rowsForXML.push({
                    row: {
                        code: item.instance_name,
                        R: !isOur ? greenColor[green_index].r : redColor[red_index].r,
                        G: !isOur ? greenColor[green_index].g : redColor[red_index].g,
                        B: !isOur ? greenColor[green_index].b : redColor[red_index].b
                    }
                });
            }

            if (compareText === "Goalkeeper's Build Up" || compareText === 'Started From Goalkeeper') display = item.action_type_name;
            else if (
                compareText === 'Offensive Half Build Up' ||
                compareText === 'Defensive Half Build Up' ||
                compareText === 'Started From Interception' ||
                compareText === 'Started From Tackle' ||
                compareText === 'Started From Throw In' ||
                compareText === 'Free Kicks' ||
                compareText === 'Crosses' ||
                compareText === 'Corners' ||
                compareText === 'Counter-Attacks' ||
                compareText === 'Penalties Gained' ||
                compareText === 'Goals' ||
                compareText === 'Goal Opportunities' ||
                compareText === 'Goal Kicks' ||
                compareText === 'Offsides' ||
                compareText === 'Turnovers'
            )
                display = item.player_name;
            else display = item.action_name + ' - ' + item.action_result_name;

            clipCounter += 1;

            return compareText === 'All Offensive Possessions' || compareText === 'All Defensive Possessions'
                ? {
                      instance: {
                          ID: clipCounter,
                          start: upperButtons.includes(compareText) ? convertToNumber(item.start_time) : convertToNumber(item.start_time) - 5,
                          end: upperButtons.includes(compareText) ? convertToNumber(item.end_time) : convertToNumber(item.end_time) + 5,
                          code: item.instance_name
                      }
                  }
                : {
                      instance: {
                          ID: clipCounter,
                          start: upperButtons.includes(compareText) ? convertToNumber(item.start_time) : convertToNumber(item.start_time) - 5,
                          end: upperButtons.includes(compareText) ? convertToNumber(item.end_time) : convertToNumber(item.end_time) + 5,
                          code: item.instance_name,
                          label: {
                              text: display
                          }
                      }
                  };
        });
    };

    const getPlayerTagList = async (id, isOur) => {
        return await GameService.getGamePlayerTags(id, null, `${game.id}`, null, null, null).then((res) => {
            const sortedList = res.sort(sortByStartTime);
            let player_names = [];
            let playerActions = [];

            sortedList.map((item) => {
                if (!player_names.includes(item.player_names)) player_names = [...player_names, item.player_names];
            });
            player_names.map((name) => {
                const player_actions = sortedList.filter((tag) => name === tag.player_names);

                rowsForXML.push({
                    row: {
                        code: name,
                        R: isOur ? greenColor[2].r : redColor[1].r,
                        G: isOur ? greenColor[2].g : redColor[1].g,
                        B: isOur ? greenColor[2].b : redColor[1].b
                    }
                });
                player_actions.map((action) => {
                    playerActions.push({
                        instance: {
                            ID: action.team_tag_id,
                            start: convertToNumber(action.player_tag_start_time),
                            end: convertToNumber(action.player_tag_end_time),
                            code: action.player_names,
                            label: {
                                text: action.action_names + ' - ' + action.action_result_names
                            }
                        }
                    });
                });
            });

            return playerActions;
        });
    };

    useEffect(async () => {
        const opponentTeamId = teamId === game.home_team_id ? game.away_team_id : game.home_team_id;

        await GameService.gameExportSportcode(teamId, `${game.id}`).then((res) => {
            allData = res;
        });

        console.log(allData);

        const OurGameHighlight = getTeamTagList('Game Highlight');
        const OurCleanGame = getTeamTagList('Clean Game');
        const OurOffensivePossession = getTeamTagList('All Offensive Possessions');
        const OurDefensivePossession = getTeamTagList('All Defensive Possessions');
        const OurOffensiveHalfBuild = getTeamTagList('Offensive Half Build Up');
        const OurDefensiveHalfBuild = getTeamTagList('Defensive Half Build Up');
        const OurGoalkeeperBuild = getTeamTagList("Goalkeeper's Build Up");
        const OurBuildonGoalkeeper = getTeamTagList('Started From Goalkeeper');
        const OurCounterAttacks = getTeamTagList('Counter-Attacks');
        const OurBuildonInterception = getTeamTagList('Started From Interception');
        const OurBuildonTackle = getTeamTagList('Started From Tackle');
        const OurBuildonThrowIn = getTeamTagList('Started From Throw In');
        const OurGoals = getTeamTagList('Goals');
        const OurShots = getTeamTagList('Shots');
        const OurFreeKicks = getTeamTagList('Free Kicks');
        const OurCorners = getTeamTagList('Corners');
        const OurCrosses = getTeamTagList('Crosses');
        const OurDrawFouls = getTeamTagList('Draw Fouls');
        const OurTurnovers = getTeamTagList('Turnovers');
        const OurOffsides = getTeamTagList('Offsides');
        const OurPenalty = getTeamTagList('Penalties Gained');
        const OurSaved = getTeamTagList('Saved');
        const OurBlocked = getTeamTagList('Blocked');
        const OurClearance = getTeamTagList('Clearance');

        const OpponentOffensivePossession = getTeamTagList('Opponent All Offensive Possessions');
        const OpponentDefensivePossession = getTeamTagList('Opponent All Defensive Possessions');
        const OpponentOffensiveHalfBuild = getTeamTagList('Opponent Offensive Half Build Up');
        const OpponentDefensiveHalfBuild = getTeamTagList('Opponent Defensive Half Build Up');
        const OpponentGoalkeeperBuild = getTeamTagList("Opponent Goalkeeper's Build Up");
        const OpponentBuildonGoalkeeper = getTeamTagList('Opponent Started From Goalkeeper');
        const OpponentCounterAttacks = getTeamTagList('Opponent Counter-Attacks');
        const OpponentBuildonInterception = getTeamTagList('Opponent Started From Interception');
        const OpponentBuildonTackle = getTeamTagList('Opponent Started From Tackle');
        const OpponentBuildonThrowIn = getTeamTagList('Opponent Started From Throw In');
        const OpponentGoals = getTeamTagList('Opponent Goals');
        const OpponentShots = getTeamTagList('Opponent Shots');
        const OpponentFreeKicks = getTeamTagList('Opponent Free Kicks');
        const OpponentCorners = getTeamTagList('Opponent Corners');
        const OpponentCrosses = getTeamTagList('Opponent Crosses');
        const OpponentDrawFouls = getTeamTagList('Opponent Draw Fouls');
        const OpponentTurnovers = getTeamTagList('Opponent Turnovers');
        const OpponentOffsides = getTeamTagList('Opponent Offsides');
        const OpponentPenalty = getTeamTagList('Opponent Penalties Gained');
        const OpponentSaved = getTeamTagList('Opponent Saved');
        const OpponentBlocked = getTeamTagList('Opponent Blocked');
        const OpponentClearance = getTeamTagList('Opponent Clearance');

        const OurPlayerTags = await getPlayerTagList(teamId, true);
        const OpponentPlayerTags = await getPlayerTagList(opponentTeamId, false);

        const XMLData = {
            file: {
                SESSION_INFO: {
                    start_time: game.date
                },
                ALL_INSTANCES: {
                    instance: {
                        ID: 0,
                        start: 0,
                        end: 10,
                        code: 'Begining of Video'
                    },
                    OurGameHighlight,
                    OurCleanGame,
                    OurOffensivePossession,
                    OurDefensivePossession,
                    OurOffensiveHalfBuild,
                    OurDefensiveHalfBuild,
                    OurGoalkeeperBuild,
                    OurBuildonGoalkeeper,
                    OurCounterAttacks,
                    OurBuildonInterception,
                    OurBuildonTackle,
                    OurBuildonThrowIn,
                    OurGoals,
                    OurShots,
                    OurFreeKicks,
                    OurCorners,
                    OurCrosses,
                    OurDrawFouls,
                    OurTurnovers,
                    OurOffsides,
                    OurPenalty,
                    OurSaved,
                    OurBlocked,
                    OurClearance,
                    OurPlayerTags,

                    OpponentOffensivePossession,
                    OpponentDefensivePossession,
                    OpponentOffensiveHalfBuild,
                    OpponentDefensiveHalfBuild,
                    OpponentGoalkeeperBuild,
                    OpponentBuildonGoalkeeper,
                    OpponentCounterAttacks,
                    OpponentBuildonInterception,
                    OpponentBuildonTackle,
                    OpponentBuildonThrowIn,
                    OpponentGoals,
                    OpponentShots,
                    OpponentFreeKicks,
                    OpponentCorners,
                    OpponentCrosses,
                    OpponentDrawFouls,
                    OpponentTurnovers,
                    OpponentOffsides,
                    OpponentPenalty,
                    OpponentSaved,
                    OpponentBlocked,
                    OpponentClearance,
                    OpponentPlayerTags
                },
                ROWS: rowsForXML
            }
        };

        const config = {
            indent: ' '
        };

        const newXMLData = toXML(XMLData, config);
        const blob = new Blob([newXMLData], { type: 'text/xml' });

        console.log(rowsForXML);
        setNewBlob(blob);
        setXML(false);
        setLoading(false);
    }, []);

    return <>{newBlob !== null && <DownloadXML blob={newBlob} game={game} />}</>;
};
