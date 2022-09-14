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
    let rowsForXML = [];
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
    const titles = [
        { our: 'All Offensive Possessions', opponent: 'All Opponents Offensive Possessions' },
        { our: 'All Defensive Possessions', opponent: 'All Opponents Defensive Possessions' },
        { our: 'Offensive Half Build Up', opponent: 'Opponents Offensive Half Build Up' },
        { our: 'Defensive Half Build Up', opponent: 'Opponents Defensive Half Build Up' },
        { our: "Goalkeeper's Build Up", opponent: "Opponents Goalkeeper's Build Up" },
        { our: 'Started From Goalkeeper', opponent: 'Started From Opponents Goalkeeper' },
        { our: 'Counter-Attacks', opponent: 'Opponents Counter-Attacks' },
        { our: 'Started From Interception', opponent: 'Started From Opponents Interception' },
        { our: 'Started From Tackle', opponent: 'Started From Opponents Tackle' },
        { our: 'Started From Throw In', opponent: 'Started From Opponents Throw In' },
        { our: 'Goals', opponent: 'Opponents Goals' },
        { our: 'Goal Opportunities', opponent: 'Opponents Goal Opportunities' },
        { our: 'Goal Kicks', opponent: 'Opponents Goal Kicks' },
        { our: 'Free Kicks', opponent: 'Opponents Free Kicks' },
        { our: 'Crosses', opponent: 'Opponents Crosses' },
        { our: 'Corners', opponent: 'Opponents Corners' },
        { our: 'Offsides', opponent: 'Opponents Offsides' },
        { our: 'Turnovers', opponent: 'Opponents Turnovers' },
        { our: 'Penalties Gained', opponent: 'Opponents Penalties Gained' }
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

    const getTeamTagList = async (func, name, isOur) => {
        return await func.then((res) => {
            const green_index = upperButtons.includes(name) ? 0 : 1;
            const red_index = upperButtons.includes(name) ? 0 : 1;
            const title = isOur ? name : titles.filter((item) => item.our === name)[0].opponent;

            rowsForXML.push({
                row: {
                    code: title,
                    R: isOur ? greenColor[green_index].r : redColor[red_index].r,
                    G: isOur ? greenColor[green_index].g : redColor[red_index].g,
                    B: isOur ? greenColor[green_index].b : redColor[red_index].b
                }
            });

            return res.map((item) => {
                const actions = item.action_names.split(' - ');
                const types = item.action_type_names.split(' - ');
                const results = item.action_result_names.split(' - ');
                const players = item.player_names.split(' - ');
                let display = '';

                if (name === "Goalkeeper's Build Up" || name === 'Started From Goalkeeper') display = types[types.length - 1];
                else if (
                    name === 'Offensive Half Build Up' ||
                    name === 'Defensive Half Build Up' ||
                    name === 'Started From Interception' ||
                    name === 'Started From Tackle' ||
                    name === 'Started From Throw In' ||
                    name === 'Free Kicks' ||
                    name === 'Crosses' ||
                    name === 'Corners' ||
                    name === 'Counter-Attacks' ||
                    name === 'Penalties Gained'
                )
                    display = players[0];
                else if (name === 'Goals' || name === 'Goal Opportunities' || name === 'Goal Kicks' || name === 'Offsides' || name === 'Turnovers') display = players[players.length - 1];
                else display = actions[actions.length - 1] + ' - ' + results[results.length - 1];

                return name === 'All Offensive Possessions' || name === 'All Defensive Possessions'
                    ? {
                          instance: {
                              ID: item.team_tag_id,
                              start: upperButtons.includes(name) ? convertToNumber(item.team_tag_start_time) : convertToNumber(item.team_tag_start_time) - 5,
                              end: upperButtons.includes(name) ? convertToNumber(item.team_tag_end_time) : convertToNumber(item.team_tag_end_time) + 5,
                              code: title
                          }
                      }
                    : {
                          instance: {
                              ID: item.team_tag_id,
                              start: upperButtons.includes(name) ? convertToNumber(item.team_tag_start_time) : convertToNumber(item.team_tag_start_time) - 5,
                              end: upperButtons.includes(name) ? convertToNumber(item.team_tag_end_time) : convertToNumber(item.team_tag_end_time) + 5,
                              code: title,
                              label: {
                                  text: display
                              }
                          }
                      };
            });
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
        const OurGameHighlight = await getTeamTagList(GameService.getGameHighlight(teamIds.teamId, `${game.id}`), 'Game Highlight', true);
        const OurOffensivePossession = await getTeamTagList(GameService.getTeamOffensivePossession(teamIds.teamId, `${game.id}`), 'All Offensive Possessions', true);
        const OurDefensivePossession = await getTeamTagList(GameService.getTeamDefensivePossession(teamIds.teamId, `${game.id}`), 'All Defensive Possessions', true);
        const OurOffensiveHalfBuildUp = await getTeamTagList(GameService.getTeamBuildOnOffensiveHalf(teamIds.teamId, `${game.id}`), 'Offensive Half Build Up', true);
        const OurDefensiveHalfBuildUp = await getTeamTagList(GameService.getTeamBuildonDefensiveHalf(teamIds.teamId, `${game.id}`), 'Defensive Half Build Up', true);
        const OurBuildUpGoalkeeper = await getTeamTagList(GameService.getTeamBuildupGoalkeeper(teamIds.teamId, `${game.id}`), "Goalkeeper's Build Up", true);
        const OurStartedofGoalkeeper = await getTeamTagList(GameService.getTeamBuildupGoalkeeperKick(teamIds.teamId, `${game.id}`), 'Started From Goalkeeper', true);
        const OurCounterAttack = await getTeamTagList(GameService.getTeamCounterAttack(teamIds.teamId, `${game.id}`), 'Counter-Attacks', true);
        const OurStartedFromInterception = await getTeamTagList(GameService.getTeamInterception(teamIds.teamId, `${game.id}`), 'Started From Interception', true);
        const OurStartedFromTackle = await getTeamTagList(GameService.getTeamTackle(teamIds.teamId, `${game.id}`), 'Started From Tackle', true);
        const OurStartedFromThrowIn = await getTeamTagList(GameService.getTeamThrowIn(teamIds.teamId, `${game.id}`), 'Started From Throw In', true);
        const OurGoals = await getTeamTagList(GameService.getTeamGoals(teamIds.teamId, `${game.id}`), 'Goals', true);
        const OurGoalOpportunity = await getTeamTagList(GameService.getTeamGoalOpportunity(teamIds.teamId, `${game.id}`), 'Goal Opportunities', true);
        const OurGoalKicks = await getTeamTagList(GameService.getTeamShots(teamIds.teamId, `${game.id}`), 'Goal Kicks', true);
        const OurFreeKicks = await getTeamTagList(GameService.getTeamFreekick(teamIds.teamId, `${game.id}`), 'Free Kicks', true);
        const OurCross = await getTeamTagList(GameService.getTeamCross(teamIds.teamId, `${game.id}`), 'Crosses', true);
        const OurCorner = await getTeamTagList(GameService.getTeamCorner(teamIds.teamId, `${game.id}`), 'Corners', true);
        const OurOffside = await getTeamTagList(GameService.getTeamOffside(teamIds.teamId, `${game.id}`), 'Offsides', true);
        const OurTurnover = await getTeamTagList(GameService.getTeamTurnover(teamIds.teamId, `${game.id}`), 'Turnovers', true);
        const OurPenalty = await getTeamTagList(GameService.getTeamPenalty(teamIds.teamId, `${game.id}`), 'Penalties Gained', true);

        const OpponentOffensivePossession = await getTeamTagList(GameService.getOpponentOffensivePossession(teamIds.teamId, `${game.id}`), 'All Offensive Possessions', false);
        const OpponentDefensivePossession = await getTeamTagList(GameService.getOpponentDefensivePossession(teamIds.teamId, `${game.id}`), 'All Defensive Possessions', false);
        const OpponentOffensiveHalfBuildUp = await getTeamTagList(GameService.getOpponentBuildOnOffensiveHalf(teamIds.teamId, `${game.id}`), 'Offensive Half Build Up', false);
        const OpponentDefensiveHalfBuildUp = await getTeamTagList(GameService.getOpponentBuildonDefensiveHalf(teamIds.teamId, `${game.id}`), 'Defensive Half Build Up', false);
        const OpponentBuildUpGoalkeeper = await getTeamTagList(GameService.getOpponentBuildupGoalkeeper(teamIds.teamId, `${game.id}`), "Goalkeeper's Build Up", false);
        const OpponentStartedofGoalkeeper = await getTeamTagList(GameService.getOpponentBuildupGoalkeeperKick(teamIds.teamId, `${game.id}`), 'Started From Goalkeeper', false);
        const OpponentCounterAttack = await getTeamTagList(GameService.getOpponentCounterAttack(teamIds.teamId, `${game.id}`), 'Counter-Attacks', false);
        const OpponentStartedFromInterception = await getTeamTagList(GameService.getOpponentInterception(teamIds.teamId, `${game.id}`), 'Started From Interception', false);
        const OpponentStartedFromTackle = await getTeamTagList(GameService.getOpponentTackle(teamIds.teamId, `${game.id}`), 'Started From Tackle', false);
        const OpponentStartedFromThrowIn = await getTeamTagList(GameService.getOpponentThrowIn(teamIds.teamId, `${game.id}`), 'Started From Throw In', false);
        const OpponentGoals = await getTeamTagList(GameService.getOpponentGoals(teamIds.teamId, `${game.id}`), 'Goals', false);
        const OpponentGoalOpportunity = await getTeamTagList(GameService.getOpponentGoalOpportunity(teamIds.teamId, `${game.id}`), 'Goal Opportunities', false);
        const OpponentGoalKicks = await getTeamTagList(GameService.getOpponentShots(teamIds.teamId, `${game.id}`), 'Goal Kicks', false);
        const OpponentFreeKicks = await getTeamTagList(GameService.getOpponentFreekick(teamIds.teamId, `${game.id}`), 'Free Kicks', false);
        const OpponentCross = await getTeamTagList(GameService.getOpponentCross(teamIds.teamId, `${game.id}`), 'Crosses', false);
        const OpponentCorner = await getTeamTagList(GameService.getOpponentCorner(teamIds.teamId, `${game.id}`), 'Corners', false);
        const OpponentOffside = await getTeamTagList(GameService.getOpponentOffside(teamIds.teamId, `${game.id}`), 'Offsides', false);
        const OpponentTurnover = await getTeamTagList(GameService.getOpponentTurnover(teamIds.teamId, `${game.id}`), 'Turnovers', false);
        const OpponentPenalty = await getTeamTagList(GameService.getOpponentPenalty(teamIds.teamId, `${game.id}`), 'Penalties Gained', false);

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
                    OurOffensivePossession,
                    OurDefensivePossession,
                    OurOffensiveHalfBuildUp,
                    OurDefensiveHalfBuildUp,
                    OurBuildUpGoalkeeper,
                    OurStartedofGoalkeeper,
                    OurCounterAttack,
                    OurStartedFromInterception,
                    OurStartedFromTackle,
                    OurStartedFromThrowIn,
                    OurGoals,
                    OurGoalOpportunity,
                    OurGoalKicks,
                    OurFreeKicks,
                    OurCross,
                    OurCorner,
                    OurOffside,
                    OurTurnover,
                    OurPenalty,
                    OurPlayerTags,

                    OpponentOffensivePossession,
                    OpponentDefensivePossession,
                    OpponentOffensiveHalfBuildUp,
                    OpponentDefensiveHalfBuildUp,
                    OpponentBuildUpGoalkeeper,
                    OpponentStartedofGoalkeeper,
                    OpponentCounterAttack,
                    OpponentStartedFromInterception,
                    OpponentStartedFromTackle,
                    OpponentStartedFromThrowIn,
                    OpponentGoals,
                    OpponentGoalOpportunity,
                    OpponentGoalKicks,
                    OpponentFreeKicks,
                    OpponentCross,
                    OpponentCorner,
                    OpponentOffside,
                    OpponentTurnover,
                    OpponentPenalty,
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

        setNewBlob(blob);
        setXML(false);
        setLoading(false);
    }, []);

    return <>{newBlob !== null && <DownloadXML blob={newBlob} game={game} />}</>;
};
