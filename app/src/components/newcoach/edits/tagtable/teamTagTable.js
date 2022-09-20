import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Checkbox } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { EditDraggableTableRow } from './draggableTableRow';

const CoachTeamTagTable = ({ tagList, setIndex, selectIdx, handleSort, updateTable, setChecks }) => {
    const [tableRows, setTableRows] = useState(tagList);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const selectedRef = useRef();

    selectedRef.current = selectedRows;

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

    const handleRowSelection = (id) => {
        let array = selectedRef.current;

        if (selectedRef.current.includes(id)) {
            setSelectAll(false);
            array = selectedRef.current.filter((item) => item !== id);
            setSelectedRows(array);
        } else {
            array = [...array, id];
            setSelectedRows(array);
        }

        console.log(array);
        setChecks(array);
    };

    const handleUpdateTable = (index, data) => {
        let array = [...tableRows];

        array[index] = data;
        updateTable(array);
    };

    const renderRow = useCallback((tag, index, selected) => {
        return (
            <EditDraggableTableRow
                key={tag.id}
                id={tag.id}
                row={tag}
                index={index}
                moveRow={moveRow}
                selected={index === selected}
                onSelect={setIndex}
                isTeam={true}
                rowChecked={selectedRef.current.includes(tag.id)}
                onCheck={handleRowSelection}
                updateList={handleUpdateTable}
            />
        );
    }, []);

    useEffect(() => {
        setTableRows(tagList);
        setSelectedRows([]);
        setSelectAll(false);
    }, [tagList]);

    useEffect(() => {
        setSelectedRows([]);
        setChecks([]);

        if (selectAll)
            tableRows.map((item) => {
                setSelectedRows((old) => [...old, item.id]);
                setChecks((old) => [...old, item.id]);
            });
    }, [selectAll]);

    useEffect(() => {
        if (selectedRows.length === tableRows.length) setSelectAll(true);
    }, [selectedRows]);

    return (
        <TableContainer style={{ height: '95%', width: '100%' }}>
            <DndProvider backend={HTML5Backend}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} />
                            </TableCell>
                            <TableCell style={{ height: '36px' }}>Clip Name</TableCell>
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

export default CoachTeamTagTable;
