import React, { useState } from 'react';

import SettingsAcademyControl from './academy';
import SettingsAcademyTeamControl from './academyTeam';
import SettingsAcademyTeamGameControl from './academyTeamGame';

const SettingsRepresentative = ({ user_id, t }) => {
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [selectedAcademyTeam, setSelectedAcademyTeam] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);

    return (
        <div className="tab-page settings_representative">
            <SettingsAcademyControl t={t} userId={user_id} select={setSelectedAcademy} />
            <SettingsAcademyTeamControl t={t} userId={user_id} academy={selectedAcademy} select={setSelectedAcademyTeam} season={setSelectedSeason} />
            <SettingsAcademyTeamGameControl t={t} academy={selectedAcademy} team={selectedAcademyTeam} season={selectedSeason} />
        </div>
    );
};

export default SettingsRepresentative;
