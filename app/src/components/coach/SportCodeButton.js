import React, { useEffect, useState, useReducer } from 'react';
import { Button } from '@mui/material';
import { toXML } from 'jstoxml';
import XmlDataFiltering from './XmlDataFiltering';

const SportCodeButton = ({ game, t, team, teamId, playerList, playersInGameList, ...rest }) => {
    const [exportXML, setExportXML] = useState(false);

    const [gameDataState, setGameDataState] = useReducer((old, action) => ({ ...old, ...action }), {
        playerListData: playerList,
        playersInGameListData: playersInGameList,
        teamData: team,
        gameData: game,
        teamIdData: teamId
    });

    const { gameData, teamData, teamIdData, playerListData, playersInGameListData } = gameDataState;

    return (
        <div {...rest}>
            <Button
                style={{ fontSize: '11px' }}
                variant="outlined"
                onClick={() => {
                    setExportXML(true);
                }}
            >
                {t('Export To SportCode')}
            </Button>

            {exportXML && <XmlDataFiltering game={gameData} team={teamData} teamId={teamIdData} playersInGameList={playersInGameListData} setExportXML={setExportXML} />}
        </div>
    );
};

export default SportCodeButton;
