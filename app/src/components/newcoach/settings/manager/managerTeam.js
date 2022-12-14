import React, { useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select } from '@mui/material';

import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import GameService from '../../../../services/game.service';
import { getComparator, stableSort } from '../../components/utilities';
import { MenuProps } from '../../components/common';

const SettingsManagerTeamControl = ({ select, season, t }) => {
    const [academyTeamList, setAcademyTeamList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [seasonList, setSeasonList] = useState([]);
    const [seasonFilter, setSeasonFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        await GameService.getAllSeasons().then((res) => {
            const desArray = stableSort(res, getComparator('desc', 'id'));

            setSeasonList(desArray);
            setSeasonFilter(desArray[0]);
            season(desArray[0]);
        });
        await GameService.getAllTeamsByCoach().then((res) => {
            setAcademyTeamList(res);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        select(null);
        setSelectedIndex(-1);
    }, [seasonFilter]);

    console.log('manager team', academyTeamList);

    return (
        <div className="settings_academy_container">
            <p className="normal-text">{t('Teams')}</p>
            <div className="academy_team_section">
                <div className="team_season_container">
                    <Select
                        value={seasonFilter}
                        onChange={(e) => {
                            setSeasonFilter(e.target.value);
                            season(e.target.value);
                        }}
                        label=""
                        variant="outlined"
                        IconComponent={ExpandMoreIcon}
                        inputProps={{ 'aria-label': 'Without label' }}
                        MenuProps={MenuProps}
                        sx={{ outline: 'none', height: '36px', width: '120px', fontSize: '0.8rem', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                    >
                        {seasonList.map((season, index) => (
                            <MenuItem key={index} value={season}>
                                {season.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                {loading ? (
                    <div style={{ width: '100%', height: '80%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="academy_team_items_container">
                        {academyTeamList.map((item, index) => (
                            <div
                                key={index}
                                className="academy_team_item"
                                style={{ background: selectedIndex === index ? '#C5EAC6' : 'white' }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    select(item);
                                }}
                            >
                                <FolderSharedIcon />
                                <p className="normal-text">{item.team_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsManagerTeamControl;
