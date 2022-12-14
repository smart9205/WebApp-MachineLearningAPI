import { CircularProgress, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { TEAM_ICON_DEFAULT } from '../../../../common/staticData';
import GameService from '../../../../services/game.service';
import { getFormattedDate } from '../../components/utilities';

const SettingsAcademyTeamGameControl = ({ academy, team, season, select, isManager = false, t }) => {
    const [gameList, setGameList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isHided, setIsHided] = useState([{ game: 0, team: 0 }]);

    const hideGames = (game_id, team_id) => {
        if (isHided.filter((item) => item.game === game_id && item.team === team_id).length > 0) {
            GameService.deleteHideGame(academy.academy_id, game_id, team_id).then((res) => {
                setIsHided((h) => h.filter((item) => item.game !== game_id || item.team !== team_id));
            });
        } else {
            GameService.addHideGame(academy.academy_id, game_id, team_id).then((res) => {
                let newHide = [...isHided];

                newHide = [...newHide, { game: game_id, team: team_id }];
                setIsHided(newHide);
            });
        }
    };

    const checkGameTeam = (game_id, team_id) => {
        return isHided.filter((item) => item.game === game_id && item.team === team_id).length > 0;
    };

    useEffect(async () => {
        setGameList([]);

        if (isManager) {
            select(null);
            setSelectedIndex(-1);
        }

        if (team && season) {
            setLoading(true);

            if (!isManager) {
                await GameService.getHideGame(academy.academy_id).then((res) => {
                    setIsHided(
                        res.map((item) => {
                            return { game: item.game_id, team: item.team_id };
                        })
                    );
                });
            }

            await GameService.getAllGamesByCoach(season.id, null, team.team_id, null).then((res) => {
                setGameList(res);
                setLoading(false);
            });
        }
    }, [team, season]);

    console.log('$$$$$$$$$', gameList, isHided);

    return (
        <div className="settings_academy_container">
            <p className="normal-text">{t('Games')}</p>
            <div className="team_game_section" style={{ width: isManager ? '560px' : '720px' }}>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="academy_items_container">
                        {gameList.map((item, index) => (
                            <div
                                key={index}
                                className="team_game_item"
                                style={{ background: isManager ? (selectedIndex === index ? '#C5EAC6' : 'white') : 'white' }}
                                onClick={() => {
                                    if (isManager) {
                                        setSelectedIndex(index);
                                        select(item);
                                    }
                                }}
                            >
                                <p className="normal-text">{getFormattedDate(item.date)}</p>
                                <div className="game_section">
                                    <img src={item.home_team_image ? item.home_team_image : TEAM_ICON_DEFAULT} />
                                    <p className="normal-text">{item.home_team_goals}</p>
                                    <p className="normal-text">{item.home_team_name}</p>
                                    {!isManager && (
                                        <IconButton color={checkGameTeam(item.id, item.home_team_id) ? 'error' : 'success'} onClick={() => hideGames(item.id, item.home_team_id)}>
                                            {checkGameTeam(item.id, item.home_team_id) ? <CloseIcon /> : <CheckBoxIcon />}
                                        </IconButton>
                                    )}
                                </div>
                                <div className="game_section">
                                    <img src={item.away_team_image ? item.away_team_image : TEAM_ICON_DEFAULT} />
                                    <p className="normal-text">{item.away_team_goals}</p>
                                    <p className="normal-text">{item.away_team_name}</p>
                                    {!isManager && (
                                        <IconButton color={checkGameTeam(item.id, item.away_team_id) ? 'error' : 'success'} onClick={() => hideGames(item.id, item.away_team_id)}>
                                            {checkGameTeam(item.id, item.away_team_id) ? <CloseIcon /> : <CheckBoxIcon />}
                                        </IconButton>
                                    )}
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
