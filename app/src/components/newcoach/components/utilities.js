import React from 'react';
import builder from 'xmlbuilder';
import fileDownload from 'js-file-download';

import gameService from '../../../services/game.service';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { getPeriod } from '../games/tabs/overview/tagListItem';

export const gameCreateCommand = async (tagList, name, games, gameIds) => {
    let videoList = await Promise.all(
        games.map(async (game) => {
            if (game.video_url?.startsWith('https://www.youtube.com')) {
                const newUrl = (await gameService.getAsyncNewStreamURL(game.video_url)).url;

                return { url: newUrl, home: game.home_team_image, away: game.away_team_image };
            }

            return { url: game.video_url, home: game.home_team_image, away: game.away_team_image };
        })
    );

    let videos = videoList.map((tag) => {
        return {
            url: tag.url,
            SecondBoxText: name.replace("'", ''),
            HomeTeamLogo: tag.home ? tag.home : TEAM_ICON_DEFAULT,
            AwayTeamLogo: tag.away ? tag.away : TEAM_ICON_DEFAULT
        };
    });

    let clips = tagList.map((tag) => {
        const period = tag.period === 1 ? 'H1' : tag.period === 2 ? 'H2' : 'OT';

        return {
            Video: gameIds.indexOf(tag.game_id) + 1,
            Trim: `${toSecond(tag.team_tag_start_time)}:${toSecond(tag.team_tag_end_time)}`,
            GameTime: `${period} ${tag.time_in_game}'`,
            GameScore: `${tag.home_team_goal} - ${tag.away_team_goal}`,
            FirstBoxText: `${tag.player_names} - ${tag.action_names} - ${tag.action_type_names} - ${tag.action_result_names}`
        };
    });

    let obj = {
        Render: {
            FileData: {
                Name: name.replace("'", ''),
                Format: 'mp4',
                Resolution: '1280x720',
                FPS: '60',
                Preset: 'ultrafast',
                FontFile: 'ArialBold.ttf',
                FontColor: 'White',
                FontSize: '35',
                FirstBoxSize: '300x60',
                FirstBoxColor: '#808080@0.7',
                FirstBoxFormat: 'rgba',
                SeconBoxSize: '500x60',
                SecondBoxColor: '#FFA500@0.7',
                SecondBoxFormat: 'rgba',
                LogoURL: 'https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png'
            },
            Videos: { Video: videos },
            Clips: { Clip: clips }
        }
    };

    const command = builder.create(obj).end({ pretty: true });

    fileDownload(command, `${name}.xml`);
};

export const gamePlayerCreateCommand = async (tagList, name, games, gameIds) => {
    let videoList = await Promise.all(
        games.map(async (game) => {
            if (game.video_url?.startsWith('https://www.youtube.com')) {
                const newUrl = (await gameService.getAsyncNewStreamURL(game.video_url)).url;

                return { url: newUrl, home: game.home_team_image, away: game.away_team_image };
            }

            return { url: game.video_url, home: game.home_team_image, away: game.away_team_image };
        })
    );

    let videos = videoList.map((tag) => {
        return {
            url: tag.url,
            SecondBoxText: name.replace("'", ''),
            HomeTeamLogo: tag.home ? tag.home : TEAM_ICON_DEFAULT,
            AwayTeamLogo: tag.away ? tag.away : TEAM_ICON_DEFAULT
        };
    });

    let clips = tagList.map((tag) => {
        const period = tag.period === 1 ? 'H1' : tag.period === 2 ? 'H2' : 'OT';

        return {
            Video: gameIds.indexOf(tag.game_id) + 1,
            Trim: `${toSecond(tag.player_tag_start_time)}:${toSecond(tag.player_tag_end_time)}`,
            GameTime: `${period} ${tag.time_in_game}'`,
            GameScore: `${tag.home_team_goal} - ${tag.away_team_goal}`,
            FirstBoxText: `${tag.player_names} - ${tag.action_names} - ${tag.action_type_names} - ${tag.action_result_names}`
        };
    });

    let obj = {
        Render: {
            FileData: {
                Name: name.replace("'", ''),
                Format: 'mp4',
                Resolution: '1280x720',
                FPS: '60',
                Preset: 'ultrafast',
                FontFile: 'ArialBold.ttf',
                FontColor: 'White',
                FontSize: '35',
                FirstBoxSize: '300x60',
                FirstBoxColor: '#808080@0.7',
                FirstBoxFormat: 'rgba',
                SeconBoxSize: '500x60',
                SecondBoxColor: '#FFA500@0.7',
                SecondBoxFormat: 'rgba',
                LogoURL: 'https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png'
            },
            Videos: { Video: videos },
            Clips: { Clip: clips }
        }
    };

    const command = builder.create(obj).end({ pretty: true });

    fileDownload(command, `${name}.xml`);
};

export const editCreateCommand = async (tagList, name) => {
    let rawVideoList = [...new Set(tagList.map((tag) => tag.video_url))];
    let videoList = [];

    await Promise.all(
        tagList.map(async (game) => {
            let newUrl = '';

            if (game.video_url?.startsWith('https://www.youtube.com')) newUrl = (await gameService.getAsyncNewStreamURL(game.video_url)).url;
            else newUrl = game.video_url;

            const duplicate = videoList.filter((item) => item.url === newUrl);

            if (duplicate.length === 0) videoList = [...videoList, { url: newUrl, home: game.home_team_logo, away: game.away_team_logo }];

            return videoList;
        })
    );

    let videos = videoList.map((tag) => {
        return {
            url: tag.url,
            SecondBoxText: name,
            HomeTeamLogo: tag.home ? tag.home : TEAM_ICON_DEFAULT,
            AwayTeamLogo: tag.away ? tag.away : TEAM_ICON_DEFAULT
        };
    });

    let clips = tagList.map((tag) => {
        return {
            Video: rawVideoList.indexOf(tag.video_url) + 1,
            Trim: `${toSecond(tag.start_time)}:${toSecond(tag.end_time)}`,
            GameTime: `${getPeriod(tag.period)} ${tag.time_in_game}'`,
            GameScore: `${tag.home_team_goal} - ${tag.away_team_goal}`,
            FirstBoxText: tag.clip_name
        };
    });

    let obj = {
        Render: {
            FileData: {
                Name: name,
                Format: 'mp4',
                Resolution: '1280x720',
                FPS: '60',
                Preset: 'ultrafast',
                FontFile: 'ArialBold.ttf',
                FontColor: 'White',
                FontSize: '35',
                FirstBoxSize: '300x60',
                FirstBoxColor: '#808080@0.7',
                FirstBoxFormat: 'rgba',
                SeconBoxSize: '500x60',
                SecondBoxColor: '#FFA500@0.7',
                SecondBoxFormat: 'rgba',
                LogoURL: 'https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png'
            },
            Videos: { Video: videos },
            Clips: { Clip: clips }
        }
    };

    const command = builder.create(obj).end({ pretty: true });

    fileDownload(command, `${name}.xml`);
};

export const downloadJsonFile = (data, setRelease) => {
    let filename = 'game.json';
    let contentType = 'application/json;charset=utf-8;';

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    setRelease(false);
};

export function toSecond(data) {
    if (!data || data === '') return 0;
    let a = data.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

export function orderedSort(array) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        return a[0].order - b[0].order;
    });

    return stabilizedThis.map((el) => el[0]);
}

export function getFormattedDate(date) {
    const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
    const array = old_format.split('-');

    return `${array[2]}/${array[1]}/${array[0]}`;
}
