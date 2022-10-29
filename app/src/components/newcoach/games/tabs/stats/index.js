import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import GameOverviewHeader from '../overview/header';
import GameService from '../../../../../services/game.service';
import GameStatsBoxList from './statBoxList';
import GameStatsChart from './statChart';

const action_results_interception = [
    // { title: 'Corner', color: 'orange' },
    { title: 'Free Kick', color: 'purple' },
    { title: 'Short Pass', color: 'pink' },
    { title: 'Long Pass', color: 'rgb(119, 77, 199)' },
    { title: 'Through Pass', color: 'red' },
    { title: 'Throw-In', color: 'blue' }
];

const action_results_cross = [
    { title: 'Blocked', color: 'pink' },
    { title: 'Cleared', color: 'darkred' },
    { title: 'Offside', color: 'rgb(239, 163, 128)' },
    { title: 'Successful', color: 'lightgreen' }
];

const action_results_dribble = [
    { title: 'Draw Foul', color: 'rgb(216, 180, 3)' },
    { title: 'Stolen By', color: 'lightblue' },
    { title: 'Successful', color: 'lightgreen' },
    { title: 'Unsuccessful', color: 'pink' }
];

const action_results_shot = [
    { title: 'On Target', color: 'lightblue' },
    { title: 'Off Target', color: 'lightgreen' },
    { title: 'Goal', color: 'darkgreen' },
    { title: 'Blocked', color: 'lightpink' }
];

const action_results_pass = [
    { title: 'Bad Pass', color: 'purple' },
    { title: 'Blocked', color: 'rgb(208, 41, 117)' },
    { title: 'Offside', color: 'rgb(241, 166, 135)' },
    { title: 'Successful', color: 'lightgreen' }
];

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
        <Box sx={{ width: '100%', background: 'white', maxHeight: '80vh', overflowY: 'auto', display: 'flex', padding: '24px 10px', gap: '10px' }}>
            <Box sx={{ minWidth: '34%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <GameOverviewHeader
                        isOur={values.isOur}
                        ourname={values.teamId === game.away_team_id ? game.away_team_name : game.home_team_name}
                        enemyname={values.opponentTeamId === game.home_team_id ? game.home_team_name : game.away_team_name}
                        onChangeTeam={handleChangeTeam}
                        mb="8px"
                    />
                    <GameStatsBoxList list={values.playerList} />
                </Box>
                <GameStatsChart chartId="interception" title="Interception" isType={true} action_results={action_results_interception} list={values.playerList} filterText="Interception" game={game} />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <GameStatsChart chartId="cross" title="Crossing" isType={false} action_results={action_results_cross} list={values.playerList} filterText="Cross" game={game} />
                    <GameStatsChart chartId="dribble" title="Dribbling" isType={false} action_results={action_results_dribble} list={values.playerList} filterText="Dribble" game={game} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <GameStatsChart chartId="shot" title="Shoting" isType={false} action_results={action_results_shot} list={values.playerList} filterText="Shot" game={game} />
                    <GameStatsChart chartId="pass" title="Passing" isType={false} action_results={action_results_pass} list={values.playerList} filterText="Pass" game={game} />
                </Box>
            </Box>
        </Box>
    );
};

export default GameStats;
