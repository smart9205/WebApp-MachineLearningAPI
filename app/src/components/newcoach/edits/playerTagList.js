import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CoachPlayerTagTable = ({ tagList, setIndex, selectIdx }) => {
    return (
        <TableContainer style={{ height: '100%', width: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Action
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Action Type
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Action Result
                        </TableCell>
                        <TableCell align="center" style={{ height: '36px' }}>
                            Player
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
                                {tag.action_name}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.action_type_name}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {tag.action_result_name}
                            </TableCell>
                            <TableCell align="center" style={{ height: '36px' }}>
                                {`${tag.player_fname} ${tag.player_lname}`}
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

export default CoachPlayerTagTable;
