import React, { useState } from 'react';

import SettingsManagerTeamControl from './managerTeam';
import SettingsAcademyTeamGameControl from '../representative/academyTeamGame';
import SettingsGamePlayerControl from './managerGamePlayer';

const SettingsManager = ({ t }) => {
    const [selectedAcademyTeam, setSelectedAcademyTeam] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedTeamGame, setSelectedTeamGame] = useState(null);

    return (
        <div className="tab-page settings_representative">
            <SettingsManagerTeamControl t={t} select={setSelectedAcademyTeam} season={setSelectedSeason} />
            <SettingsAcademyTeamGameControl t={t} academy={null} team={selectedAcademyTeam} season={selectedSeason} select={setSelectedTeamGame} isManager={true} />
            <SettingsGamePlayerControl t={t} team={selectedAcademyTeam} game={selectedTeamGame} />
        </div>
    );
};

export default SettingsManager;
