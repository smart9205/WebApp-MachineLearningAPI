import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import GameOverviewHeader from '../overview/header';
import GameService from '../../../../../services/game.service';
import GameStatsBoxList from './statBoxList';

const GameStats = ({ game }) => {
    const [values, setValues] = useState({
        isOur: true,
        expandButtons: true,
        playerList: [],
        teamId: -1,
        opponentTeamId: -1,
        selectAll: false,
        clickEventName: ''
    });
    const [loading, setLoading] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    const handleChangeTeam = (flag) => {
        setValues({ ...values, isOur: flag, playerList: [] });
    };

    useEffect(async () => {
        if (values.playerList.length === 0) {
            setLoading(true);

            if (values.teamId === -1 || values.opponentTeamId === -1) {
                let team = 0;
                let opponent = 0;

                await GameService.getAllMyCoachTeam().then((res) => {
                    const filtered = res.filter(
                        (item) => item.season_name === game.season_name && item.league_name === game.league_name && (item.team_id === game.home_team_id || item.team_id === game.away_team_id)
                    );

                    team = filtered[0].team_id;
                    opponent = team === game.home_team_id ? game.away_team_id : game.home_team_id;
                });
                await GameService.getGamePlayerTags(currentUser.id, values.isOur ? team : opponent, null, `${game.id}`, null, null, null).then((res) => {
                    setValues({ ...values, teamId: team, opponentTeamId: opponent, playerList: res });
                    setLoading(false);
                });
            } else {
                await GameService.getGamePlayerTags(currentUser.id, values.isOur ? values.teamId : values.opponentTeamId, null, `${game.id}`, null, null, null).then((res) => {
                    setValues({ ...values, playerList: res });
                    setLoading(false);
                });
            }
        }
    }, [values]);

    console.log('game stats => ', values.playerList);

    return (
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex' }}>
            <Box sx={{ padding: '24px 16px', minWidth: '400px' }}>
                <GameOverviewHeader
                    isOur={values.isOur}
                    ourname={values.teamId === game.away_team_id ? game.away_team_name : game.home_team_name}
                    enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                    onChangeTeam={handleChangeTeam}
                    mb="8px"
                />
                <GameStatsBoxList list={values.playerList} />
            </Box>
        </Box>
    );
};

export default GameStats;
