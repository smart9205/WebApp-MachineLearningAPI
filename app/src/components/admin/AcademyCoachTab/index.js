import React, { useState } from 'react';

import AcademyCoachControl from './academyCoachControl';
import AcademyControl1 from './academyControl';
import AcademyCoachTeamControl from './academyTeamControl';
import AcademyLeagueControl from './leagueControl';

const AcademyCoachTab = () => {
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [selectedAcademyCoach, setSelectedAcademyCoach] = useState(null);
    const [selectedLeague, setSelectedLeague] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
            <AcademyControl1 select={setSelectedAcademy} />
            <AcademyCoachControl academy={selectedAcademy} select={setSelectedAcademyCoach} />
            <AcademyLeagueControl academy={selectedAcademyCoach} select={setSelectedLeague} />
            <AcademyCoachTeamControl academy={selectedAcademyCoach} league={selectedLeague} />
        </div>
    );
};

export default AcademyCoachTab;
