import React, { useState } from 'react';

import AcademyControl from './academyControl';
import AcademyTeamControl from './academyTeamControl';
import RepresentativeControl from './representativeControl';

const RepresentativeTab = () => {
    const [selectedRepresent, setSelectedRepresent] = useState(null);
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <RepresentativeControl select={setSelectedRepresent} />
            <AcademyControl representative={selectedRepresent} select={setSelectedAcademy} />
            <AcademyTeamControl representative={selectedRepresent} academy={selectedAcademy} select={setSelectedTeam} />
        </div>
    );
};

export default RepresentativeTab;
