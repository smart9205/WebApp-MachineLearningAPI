import React, { useEffect } from 'react';
import { toXML } from 'jstoxml';
import DownloadXML from '../../coach/DownloadXML';
import { greenColor, redColor } from '../../coach/Colors';

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
