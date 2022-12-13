import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';

import GameService from '../../../services/game.service';
import TeamGames from './tabs/games';
import TeamOverview from './tabs/overview';
import TeamPlayersStats from './tabs/players';
import TeamPlayersOverview from './tabs/player_overview';
import GameSelectControl from './tabs/overview/gameSelectControl';
import TeamStats from './tabs/stats';

import '../coach_style.css';

const Tabs = ['Overview', 'Stats', 'Games', 'Players Overview', 'Players Stats'];

const TeamPage = ({ t }) => {
    const params = useParams();
    const [values, setValues] = useState({
        teamName: '',
        teamId: -1,
        seasonId: -1,
        leagueId: -1,
        loading: false,
        loadingDone: false
    });
    const [gameList, setGameList] = useState([]);
    const [gameIds, setGameIds] = useState([]);
    const [curTab, setCurTab] = useState(0);

    useEffect(async () => {
        const pathname = window.location.pathname;

        if (pathname.match(/\/new_coach\/teams\//) !== null) {
            const ids = atob(params.teamId).split('|');

            setValues({ ...values, loading: true });
            await GameService.getAllGamesByCoach(ids[1], null, ids[0], null).then((res) => {
                setGameList(res);
            });
            await GameService.getCoachTeamPlayers(ids[0], ids[1], ids[2]).then((res) => {
                setValues({ ...values, teamName: res[0].team_name, loading: false, loadingDone: true, teamId: ids[0], seasonId: ids[1], leagueId: ids[2] });
            });
        }
    }, [params]);

    return (
        <div className="coach-page-style">
            <div className="page-header">
                <div className="page-title-bar">
                    <Link to="/new_coach/teams">
                        <ChevronLeftIcon sx={{ width: '32px', height: '32px' }} />
                    </Link>
                    <p className="page-title">
                        {t('Team')}
                        {values.teamName}
                    </p>
                </div>
                <div className="page-tab-container">
                    {Tabs.map((tab, index) => (
                        <div key={index} onClick={() => setCurTab(index)} className="page-tab-style">
                            <p className="page-tab-title">{t(tab)}</p>
                            {curTab === index ? <div className="selected-line" /> : <div className="unselected-line" />}
                        </div>
                    ))}
                    <GameSelectControl gameList={gameList} t={t} setIds={setGameIds} />
                </div>
            </div>
            {values.loading && (
                <div className="loading-circle">
                    <CircularProgress />
                </div>
            )}
            {values.loadingDone && (
                <>
                    {curTab === 0 && <TeamOverview games={gameList} t={t} gameIds={gameIds} teamname={values.teamName} teamId={values.teamId} />}

                    {curTab === 1 && <TeamStats games={gameList} t={t} gameIds={gameIds} teamId={values.teamId} />}

                    {curTab === 2 && <TeamGames games={gameList} t={t} gameIds={gameIds} teamId={values.teamId} seasonId={values.seasonId} />}

                    {curTab === 3 && <TeamPlayersOverview games={gameList} t={t} gameIds={gameIds} teamId={values.teamId} teamName={values.teamName} />}

                    {curTab === 4 && <TeamPlayersStats teamId={values.teamId} t={t} seasonId={values.seasonId} leagueId={values.leagueId} gameIds={gameIds} games={gameList} />}
                </>
            )}
        </div>
    );
};

export default TeamPage;
