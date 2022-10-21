import { Button, Typography } from '@mui/material';
import React, { useState } from 'react';

import { getComparator, stableSort } from '../components/utilities';
import LeadersPlayerStatItem from './playerStatItem';
import '../coach_style.css';

const LeadersPlayerStatColumn = ({ list, title, option, isTotal, onClick }) => {
    const sortedList = stableSort(list, getComparator('desc', isTotal ? `total_${option}` : `average_${option}`));
    const property = isTotal ? `total_${option}` : `average_${option}`;
    const filteredList = sortedList.filter((item) => item[property] !== 0);

    const [isFull, setIsFull] = useState(false);

    return (
        <div style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E8E8', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
            <div>
                <div style={{ width: '100%', height: '40px', borderRadius: '8px', background: '#0A7304', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="leaders-column-title">{title}</p>
                </div>
                <div style={{ maxHeight: '530px', overflowY: 'auto' }}>
                    {(isFull ? filteredList : filteredList.slice(0, 5)).map((item, index) => (
                        <LeadersPlayerStatItem key={index} player={item} option={option} isTotal={isTotal} onShow={onClick} />
                    ))}
                </div>
            </div>
            {!isFull && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Button variant="contained" sx={{ background: '#C5EAC6', '&:hover': { background: '#0A7304' }, width: '50%', height: '36px', fontSize: '0.7rem' }} onClick={() => setIsFull(true)}>
                        Full List
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LeadersPlayerStatColumn;
