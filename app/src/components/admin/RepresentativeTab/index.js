import React, { useState } from 'react';

import AcademyControl from './academyControl';
import RepresentativeControl from './representativeControl';

const RepresentativeTab = () => {
    const [selectedRepresent, setSelectedRepresent] = useState(null);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <RepresentativeControl select={setSelectedRepresent} />
            <AcademyControl representative={selectedRepresent} />
        </div>
    );
};

export default RepresentativeTab;
