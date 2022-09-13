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
        'Clean Game',
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

    const getPlayTagList = async (func, name, isOur) => {
        return await func.then((res) => {
            return res.map((item) => {
                const green_index = upperButtons.includes(name) ? 0 : 1;
                const red_index = upperButtons.includes(name) ? 0 : 1;
                const XMLdata = {
                    instance: {
                        ID: item.team_tag_id,
                        start: upperButtons.includes(name) ? convertToNumber(item.team_tag_start_time) : convertToNumber(item.team_tag_start_time) - 5,
                        end: upperButtons.includes(name) ? convertToNumber(item.team_tag_end_time) : convertToNumber(item.team_tag_end_time) + 5,
                        code: name,
                        label: {
                            text: upperButtons.includes(name) ? `${item.action_names} = ${item.action_type_names} = ${item.action_result_names}` : item.player_names
                        }
                    }
                };

                rowsForXML.push({
                    row: {
                        code: name,
                        R: isOur ? greenColor[green_index].r : redColor[red_index].r,
                        G: isOur ? greenColor[green_index].g : redColor[red_index].g,
                        B: isOur ? greenColor[green_index].b : redColor[red_index].b
                    }
                });

                return XMLdata;
            });
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
        const OurGameHighlight = await getPlayTagList(GameService.getGameHighlight(teamIds.teamId, `${game.id}`), 'Game Highlight', true);
        const OurCleanGame = await getPlayTagList(GameService.getCleanGame(teamIds.teamId, `${game.id}`), 'Clean Game', true);
        const OurOffensivePossession = await getPlayTagList(GameService.getTeamOffensivePossession(teamIds.teamId, `${game.id}`), 'All Offensive Possessions', true);
        const OurDefensivePossession = await getPlayTagList(GameService.getTeamDefensivePossession(teamIds.teamId, `${game.id}`), 'All Defensive Possessions', true);
        const OurOffensiveHalfBuildUp = await getPlayTagList(GameService.getTeamBuildOnOffensiveHalf(teamIds.teamId, `${game.id}`), 'Offensive Half Build Up', true);
        const OurDefensiveHalfBuildUp = await getPlayTagList(GameService.getTeamBuildonDefensiveHalf(teamIds.teamId, `${game.id}`), 'Defensive Half Build Up', true);
        const OurGoalkeeperBuildUp = await getPlayTagList(GameService.getTeamBuildupGoalkeeper(teamIds.teamId, `${game.id}`), "Goalkeeper's Build Up", true);
        const OurStartedGoalkeeper = await getPlayTagList(GameService.getTeamBuildupGoalkeeperKick(teamIds.teamId, `${game.id}`), 'Started From Goalkeeper', true);
        const OurCounterAttack = await getPlayTagList(GameService.getTeamCounterAttack(teamIds.teamId, `${game.id}`), 'Counter-Attacks', true);
        const OurInterception = await getPlayTagList(GameService.getTeamInterception(teamIds.teamId, `${game.id}`), 'Started From Interception', true);
        const OurTackle = await getPlayTagList(GameService.getTeamTackle(teamIds.teamId, `${game.id}`), 'Started From Tackle', true);
        const OurThrowIn = await getPlayTagList(GameService.getTeamThrowIn(teamIds.teamId, `${game.id}`), 'Started From Throw In', true);
        const OurGoals = await getPlayTagList(GameService.getTeamGoals(teamIds.teamId, `${game.id}`), 'Goals', true);
        const OurGoalOpportunity = await getPlayTagList(GameService.getTeamGoalOpportunity(teamIds.teamId, `${game.id}`), 'Goal Opportunities', true);
        const OurGoalKicks = await getPlayTagList(GameService.getTeamShots(teamIds.teamId, `${game.id}`), 'Goal Kicks', true);
        const OurFreeKicks = await getPlayTagList(GameService.getTeamFreekick(teamIds.teamId, `${game.id}`), 'Free Kicks', true);
        const OurCross = await getPlayTagList(GameService.getTeamCross(teamIds.teamId, `${game.id}`), 'Crosses', true);
        const OurCorner = await getPlayTagList(GameService.getTeamCorner(teamIds.teamId, `${game.id}`), 'Corners', true);
        const OurOffside = await getPlayTagList(GameService.getTeamOffside(teamIds.teamId, `${game.id}`), 'Offsides', true);
        const OurTurnover = await getPlayTagList(GameService.getTeamTurnover(teamIds.teamId, `${game.id}`), 'Turnovers', true);
        const OurDrawFoul = await getPlayTagList(GameService.getTeamDrawfoul(teamIds.teamId, `${game.id}`), 'Draw Fouls', true);
        const OurPenalty = await getPlayTagList(GameService.getTeamPenalty(teamIds.teamId, `${game.id}`), 'Penalties Gained', true);
        const OurSaved = await getPlayTagList(GameService.getTeamSaved(teamIds.teamId, `${game.id}`), 'Saved', true);
        const OurClearance = await getPlayTagList(GameService.getTeamClearance(teamIds.teamId, `${game.id}`), 'Clearance', true);
        const OurBlocked = await getPlayTagList(GameService.getTeamBlocked(teamIds.teamId, `${game.id}`), 'Blocked', true);

        const OpponentOffensivePossession = await getPlayTagList(GameService.getOpponentOffensivePossession(teamIds.teamId, `${game.id}`), 'All Offensive Possessions', false);
        const OpponentDefensivePossession = await getPlayTagList(GameService.getOpponentDefensivePossession(teamIds.teamId, `${game.id}`), 'All Defensive Possessions', false);
        const OpponentOffensiveHalfBuildUp = await getPlayTagList(GameService.getOpponentBuildOnOffensiveHalf(teamIds.teamId, `${game.id}`), 'Offensive Half Build Up', false);
        const OpponentDefensiveHalfBuildUp = await getPlayTagList(GameService.getOpponentBuildonDefensiveHalf(teamIds.teamId, `${game.id}`), 'Defensive Half Build Up', false);
        const OpponentGoalkeeperBuildUp = await getPlayTagList(GameService.getOpponentBuildupGoalkeeper(teamIds.teamId, `${game.id}`), "Goalkeeper's Build Up", false);
        const OpponentStartedGoalkeeper = await getPlayTagList(GameService.getOpponentBuildupGoalkeeperKick(teamIds.teamId, `${game.id}`), 'Started From Goalkeeper', false);
        const OpponentCounterAttack = await getPlayTagList(GameService.getOpponentCounterAttack(teamIds.teamId, `${game.id}`), 'Counter-Attacks', false);
        const OpponentInterception = await getPlayTagList(GameService.getOpponentInterception(teamIds.teamId, `${game.id}`), 'Started From Interception', false);
        const OpponentTackle = await getPlayTagList(GameService.getOpponentTackle(teamIds.teamId, `${game.id}`), 'Started From Tackle', false);
        const OpponentThrowIn = await getPlayTagList(GameService.getOpponentThrowIn(teamIds.teamId, `${game.id}`), 'Started From Throw In', false);
        const OpponentGoals = await getPlayTagList(GameService.getOpponentGoals(teamIds.teamId, `${game.id}`), 'Goals', false);
        const OpponentGoalOpportunity = await getPlayTagList(GameService.getOpponentGoalOpportunity(teamIds.teamId, `${game.id}`), 'Goal Opportunities', false);
        const OpponentGoalKicks = await getPlayTagList(GameService.getOpponentShots(teamIds.teamId, `${game.id}`), 'Goal Kicks', false);
        const OpponentFreeKicks = await getPlayTagList(GameService.getOpponentFreekick(teamIds.teamId, `${game.id}`), 'Free Kicks', false);
        const OpponentCross = await getPlayTagList(GameService.getOpponentCross(teamIds.teamId, `${game.id}`), 'Crosses', false);
        const OpponentCorner = await getPlayTagList(GameService.getOpponentCorner(teamIds.teamId, `${game.id}`), 'Corners', false);
        const OpponentOffside = await getPlayTagList(GameService.getOpponentOffside(teamIds.teamId, `${game.id}`), 'Offsides', false);
        const OpponentTurnover = await getPlayTagList(GameService.getOpponentTurnover(teamIds.teamId, `${game.id}`), 'Turnovers', false);
        const OpponentDrawFoul = await getPlayTagList(GameService.getOpponentDrawfoul(teamIds.teamId, `${game.id}`), 'Draw Fouls', false);
        const OpponentPenalty = await getPlayTagList(GameService.getOpponentPenalty(teamIds.teamId, `${game.id}`), 'Penalties Gained', false);
        const OpponentSaved = await getPlayTagList(GameService.getOpponentSaved(teamIds.teamId, `${game.id}`), 'Saved', false);
        const OpponentClearance = await getPlayTagList(GameService.getOpponentClearance(teamIds.teamId, `${game.id}`), 'Clearance', false);
        const OpponentBlocked = await getPlayTagList(GameService.getOpponentBlocked(teamIds.teamId, `${game.id}`), 'Blocked', false);

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
                    OurOffensiveHalfBuildUp,
                    OurDefensiveHalfBuildUp,
                    OurGoalkeeperBuildUp,
                    OurStartedGoalkeeper,
                    OurCounterAttack,
                    OurInterception,
                    OurTackle,
                    OurThrowIn,
                    OurGoals,
                    OurGoalOpportunity,
                    OurGoalKicks,
                    OurFreeKicks,
                    OurCross,
                    OurCorner,
                    OurOffside,
                    OurTurnover,
                    OurDrawFoul,
                    OurPenalty,
                    OurSaved,
                    OurClearance,
                    OurBlocked,

                    OpponentOffensivePossession,
                    OpponentDefensivePossession,
                    OpponentOffensiveHalfBuildUp,
                    OpponentDefensiveHalfBuildUp,
                    OpponentGoalkeeperBuildUp,
                    OpponentStartedGoalkeeper,
                    OpponentCounterAttack,
                    OpponentInterception,
                    OpponentTackle,
                    OpponentThrowIn,
                    OpponentGoals,
                    OpponentGoalOpportunity,
                    OpponentGoalKicks,
                    OpponentFreeKicks,
                    OpponentCross,
                    OpponentCorner,
                    OpponentOffside,
                    OpponentTurnover,
                    OpponentDrawFoul,
                    OpponentPenalty,
                    OpponentSaved,
                    OpponentClearance,
                    OpponentBlocked
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
