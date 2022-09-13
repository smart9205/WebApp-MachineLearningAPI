import React from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from '@mui/material';

const CoachTeamTagTable = ({ tagList, setIndex, selectIdx }) => {
    const getPeriod = (period) => {
        return period === 1 ? '1st Half' : period === 2 ? '2nd Half' : 'Overtime';
    };

    return (
        <TableContainer style={{ height: '100%', width: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Period
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Offensive Team
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Defensive Team
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Start Time
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            End Time
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tagList.map((tag, index) => (
                        <TableRow key={index} style={{ cursor: 'pointer' }} onClick={() => setIndex(index)} selected={selectIdx === index}>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {getPeriod(tag.period)}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.offensive_team_name}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.defensive_team_name}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.start_time}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.end_time}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CoachTeamTagTable;
