import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

import CheckIcon from '../../../../assets/green_checked.png';
import CloseIcon from '../../../../assets/cancel.png';

import { TEAM_ICON_DEFAULT } from '../../../../common/staticData';
import GameService from '../../../../services/game.service';
import { getFormattedDate } from '../../components/utilities';

const SettingsAcademyTeamGameControl = ({ team, season }) => {
    const [gameList, setGameList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setGameList([]);

        if (team && season) {
            setLoading(true);
            GameService.getAllGamesByCoach(season.id, null, team.team_id, null).then((res) => {
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
                                    <p className="normal-text">{item.home_team_goals}</p>
                                    <p className="normal-text">{item.home_team_name}</p>
                                    {item.home_team_goals > item.away_team_goals ? <img src={CheckIcon} /> : <img src={CloseIcon} />}
                                </div>
                                <div className="game_section">
                                    <img src={item.away_team_image ? item.away_team_image : TEAM_ICON_DEFAULT} />
                                    <p className="normal-text">{item.away_team_goals}</p>
                                    <p className="normal-text">{item.away_team_name}</p>
                                    {item.home_team_goals < item.away_team_goals ? <img src={CheckIcon} /> : <img src={CloseIcon} />}
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
