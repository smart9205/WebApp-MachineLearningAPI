import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EditVideoPlayer from './edits/videoplayer';
import GameService from '../../services/game.service';

const CoachSharedEditVideoPlayer = () => {
    const params = useParams();
    const [curTagIndex, setCurTagIndex] = useState(0);
    const [tagList, setTagList] = useState([]);

    useEffect(async () => {
        let edit = null;
        const pathname = window.location.pathname;

        if (pathname.match(/\/shareedit\//) !== null) {
            await GameService.verifyShareId({ code: params.code }).then((res) => {
                edit = res[0];
            });
            await GameService.getEditClipsByUserEditId(edit.id).then((res) => {
                setTagList(res);
            });
        }
    }, [params.code]);

    console.log('share video => ', tagList);

    return (
        <div style={{ display: 'flex' }}>
            <EditVideoPlayer idx={curTagIndex} tagList={tagList} onChangeClip={setCurTagIndex} drawOpen={false} />
        </div>
    );
};

export default CoachSharedEditVideoPlayer;
