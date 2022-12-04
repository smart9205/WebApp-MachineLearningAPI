import React, { useEffect, useState } from 'react';

import GameService from '../../../services/game.service';
import RepresentativeControl from './representativeControl';

const RepresentativeTab = () => {
    const [representList, setRepresentList] = useState([]);

    const loadAllRepresentatives = () => {
        GameService.getAllRepresentatives().then((res) => {
            setRepresentList(res);
        });
    };

    useEffect(() => {
        loadAllRepresentatives();
    }, []);

    console.log('represent => ', representList);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <RepresentativeControl list={representList} refreshList={loadAllRepresentatives} />
        </div>
    );
};

export default RepresentativeTab;
