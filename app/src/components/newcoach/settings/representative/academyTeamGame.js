import { CircularProgress, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { TEAM_ICON_DEFAULT } from '../../../../common/staticData';
import GameService from '../../../../services/game.service';
import { getFormattedDate } from '../../components/utilities';

const SettingsAcademyTeamGameControl = ({ academy, team, season }) => {
    const [gameList, setGameList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isHided, setIsHided] = useState([]);
    const isHidedRef = useRef();

    isHidedRef.current = isHided;

    const hideGames = (team_id, game_id) => {
        if (isHidedRef.current.filter((item) => item.game === game_id && item.team === team_id).length > 0) {
            GameService.deleteHideGame(academy.academy_id, game_id, team_id).then((res) => {
                const newHide = isHidedRef.current.filter((item) => item.game !== game_id && item.team !== team_id);

                setIsHided(newHide);
            });
        } else {
            GameService.addHideGame(academy.academy_id, game_id, team_id).then((res) => {
                let newHide = isHidedRef.current;

                newHide = [...newHide, { game: game_id, team: team_id }];
                setIsHided(newHide);
            });
        }
    };

    const checkGameTeam = (game_id, team_id) => {
        return isHidedRef.current.filter((item) => item.game === game_id && item.team === team_id).length > 0;
    };

    useEffect(async () => {
        setGameList([]);

        if (team && season) {
            setLoading(true);
            await GameService.getHideGame(academy.academy_id).then((res) => {
                setIsHided(
                    res.map((item) => {
                        return { game: item.game_id, team: item.team_id };
                    })
                );
            });
            await GameService.getAllGamesByCoach(season.id, null, team.team_id, null).then((res) => {
                setGameList(res);
                setLoading(false);
            });
        }
    }, [team, season]);

    console.log('$$$$$$$$$', gameList);

    return (
        <div className="settings_academy_container">
            <p className="normal-text">Games</p>
            <div className="team_game_section">
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="academy_items_container">
                        {gameList.map((item, index) => (
                            <div key={index} className="team_game_item">
                                <p className="normal-text">{getFormattedDate(item.date)}</p>
                                <div className="game_section">
                                    <img src={item.home_team_image ? item.home_team_image : TEAM_ICON_DEFAULT} />
                                    <p className="normal-text-strong">{item.home_team_goals}</p>
                                    <p className="normal-text">{item.home_team_name}</p>
                                    <IconButton color={checkGameTeam(item.id, item.home_team_id) ? 'error' : 'success'} onClick={() => hideGames(item.home_team_id, item.id)}>
                                        {checkGameTeam(item.id, item.home_team_id) ? <CloseIcon fontSize="large" /> : <CheckBoxIcon fontSize="large" />}
                                    </IconButton>
                                </div>
                                <div className="game_section">
                                    <img src={item.away_team_image ? item.away_team_image : TEAM_ICON_DEFAULT} />
                                    <p className="normal-text-strong">{item.away_team_goals}</p>
                                    <p className="normal-text">{item.away_team_name}</p>
                                    <IconButton color={checkGameTeam(item.id, item.away_team_id) ? 'error' : 'success'} onClick={() => hideGames(item.away_team_id, item.id)}>
                                        {checkGameTeam(item.id, item.away_team_id) ? <CloseIcon fontSize="large" /> : <CheckBoxIcon fontSize="large" />}
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsAcademyTeamGameControl;
