import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { EditDraggableTableRow } from './draggableTableRow';

const CoachPlayerTagTable = ({ tagList, setIndex, selectIdx, handleSort }) => {
    const [tableRows, setTableRows] = useState(tagList);

    useEffect(() => {
        setTableRows(tagList);
    }, [tagList]);

    const moveRow = useCallback((dragIndex, hoverIndex) => {
        setTableRows((prevCards) => {
            const newRow = update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex]]
                ]
            });
            const start = dragIndex < hoverIndex ? dragIndex : hoverIndex;
            const end = (dragIndex > hoverIndex ? dragIndex : hoverIndex) + 1;

            handleSort(
                newRow.slice(start, end).map((row, i) => {
                    return { ...row, sort: start + i };
                })
            );

            return newRow;
        });
    }, []);

    const renderRow = useCallback((tag, index, selected) => {
        console.log('Team Table => ', selected);
        return <EditDraggableTableRow key={tag.id} id={tag.id} row={tag} index={index} moveRow={moveRow} selected={index === selected} onClick={() => setIndex(index)} isTeam={false} />;
    }, []);

    return (
        <TableContainer style={{ height: '100%', width: '100%' }}>
            <DndProvider backend={HTML5Backend}>
                <Table stickyHeader aria-label="sticky table">
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
                    <TableBody>{tableRows.map((tag, index) => renderRow(tag, index, selectIdx))}</TableBody>
                </Table>
            </DndProvider>
        </TableContainer>
    );
};

export default CoachPlayerTagTable;
