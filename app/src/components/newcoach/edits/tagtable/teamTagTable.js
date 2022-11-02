import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Checkbox } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { EditDraggableTableRow } from './draggableTableRow';
import CorrectionsVideoPlayer from '../../corrections/videoDialog';
import GameService from '../../../../services/game.service';

const CoachTeamTagTable = ({ tagList, setIndex, selectIdx, handleSort, updateTable, setChecks, showPlay }) => {
    const [tableRows, setTableRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const selectedRef = useRef();
    const [playOpen, setPlayOpen] = useState(false);
    const [correctItem, setCorrectItem] = useState(null);

    selectedRef.current = selectedRows;

    const moveRow = useCallback((dragIndex, hoverIndex, isDropped) => {
        console.log('dragging => ', isDropped);
        if (!isDropped)
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
                    }),
                    false
                );

                return newRow;
            });
        else handleSort(null, true);
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

    const handleUpdateTable = useCallback(async (index, data) => {
        console.log('edit####', data);
        setTableRows((prev) => update(prev, { [index]: { $set: data } }));
        await GameService.updateEditClip(data);
        updateTable();
    }, []);

    const renderRow = useCallback((tag, index, selected, play) => {
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
                showPlay={play}
                setItem={setCorrectItem}
                onPlay={setPlayOpen}
            />
        );
    }, []);

    useEffect(() => {
        if (tagList !== tableRows) {
            setTableRows(tagList);
            setSelectedRows([]);
            setSelectAll(false);
        }
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
        if (selectedRows.length === tableRows.length && tableRows.length > 0) setSelectAll(true);
    }, [selectedRows]);

    return (
        <>
            <TableContainer style={{ height: '94%', width: '100%' }}>
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
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>{tableRows.map((tag, index) => renderRow(tag, index, selectIdx, showPlay))}</TableBody>
                    </Table>
                </DndProvider>
            </TableContainer>
            {playOpen && (
                <CorrectionsVideoPlayer
                    onClose={() => setPlayOpen(false)}
                    video_url={correctItem?.video_url ?? ''}
                    start={correctItem?.start_time ?? '00:00:00'}
                    end={correctItem?.end_time ?? '00:00:00'}
                    name={correctItem?.clip_name ?? ''}
                />
            )}
        </>
    );
};

export default CoachTeamTagTable;
