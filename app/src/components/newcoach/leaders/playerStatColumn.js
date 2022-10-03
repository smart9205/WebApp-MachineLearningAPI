import { Typography } from '@mui/material';
import React from 'react';
import { getComparator, stableSort } from '../components/utilities';
import LeadersPlayerStatItem from './playerStatItem';

const LeadersPlayerStatColumn = ({ list, title, option, isTotal }) => {
    const sortedList = stableSort(list, getComparator('desc', isTotal ? `total_${option}` : `average_${option}`));
    const property = isTotal ? `total_${option}` : `average_${option}`;
    const filteredList = sortedList.filter((item) => item[property] !== 0);

    return (
        <div style={{ width: '350px', paddingBottom: '8px', borderRadius: '8px', border: '1px solid #E8E8E8' }}>
            <div style={{ width: '100%', height: '40px', borderRadius: '8px', background: '#0A7304', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: 'white' }}>{title}</Typography>
            </div>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredList.map((item, index) => (
                    <LeadersPlayerStatItem key={index} player={item} option={option} isTotal={isTotal} />
                ))}
            </div>
        </div>
    );
};

export default LeadersPlayerStatColumn;
