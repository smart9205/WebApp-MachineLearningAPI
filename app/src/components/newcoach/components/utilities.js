import React from 'react';
import builder from 'xmlbuilder';
import fileDownload from 'js-file-download';

import gameService from '../../../services/game.service';

export const gameCreateCommand = async (tagList, name, rawVideoList, gameIds) => {
    let videoList = await Promise.all(
        rawVideoList.map(async (url) => {
            if (url?.startsWith('https://www.youtube.com')) {
                return (await gameService.getAsyncNewStreamURL(url)).url;
            }
            return url;
        })
    );

    let videos = videoList.map((tag, i) => {
        return {
            url: tag,
            SecondBoxText: name.replace("'", '')
        };
    });

    let clips = tagList.map((tag, i) => {
        const period = tag.period === 1 ? 'H1' : tag.period === 2 ? 'H2' : 'OT';

        return {
            Video: gameIds.indexOf(tag.game_id) + 1,
            Trim: `${toSecond(tag.team_tag_start_time)}:${toSecond(tag.team_tag_end_time)}`,
            FirstBoxText: `${period} - ${tag.time_in_game}`
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

export const gamePlayerCreateCommand = async (tagList, name, rawVideoList, gameIds) => {
    let videoList = await Promise.all(
        rawVideoList.map(async (url) => {
            if (url?.startsWith('https://www.youtube.com')) {
                return (await gameService.getAsyncNewStreamURL(url)).url;
            }
            return url;
        })
    );

    let videos = videoList.map((tag, i) => {
        return {
            url: tag,
            SecondBoxText: name.replace("'", '')
        };
    });

    let clips = tagList.map((tag, i) => {
        const period = tag.period === 1 ? 'H1' : tag.period === 2 ? 'H2' : 'OT';

        return {
            Video: gameIds.indexOf(tag.game_id) + 1,
            Trim: `${toSecond(tag.player_tag_start_time)}:${toSecond(tag.player_tag_end_time)}`,
            FirstBoxText: `${period} - ${tag.time_in_game}`
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
    let videoList = await Promise.all(
        rawVideoList.map(async (url) => {
            if (url?.startsWith('https://www.youtube.com')) {
                return (await gameService.getAsyncNewStreamURL(url)).url;
            }
            return url;
        })
    );

    let videos = videoList.map((tag, i) => {
        return {
            url: tag,
            SecondBoxText: name
        };
    });

    let clips = tagList.map((tag) => {
        return {
            Video: rawVideoList.indexOf(tag.video_url) + 1,
            Trim: `${toSecond(tag.start_time)}:${toSecond(tag.end_time)}`,
            FirstBoxText: tag.name
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
