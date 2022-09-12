import React, { useCallback, useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PlayerTagRow } from './PlayerTagRow';
import DeleteConfirmDialog from '../../../../common/DeleteConfirmDialog';

export default function DragableIndivitualTagTable({ rows, handleRowClick, selected, onPlay, handleSort, onDelete, t, ...params }) {
    const [tableRows, setTableRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const selectedRef = useRef();
    const rowsRef = useRef();

    selectedRef.current = selectedRows;
    rowsRef.current = tableRows;

    useEffect(() => {
        setTableRows(rows);
        setSelectedRows([]);
        setSelectAll(false);
    }, [rows]);

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

    useEffect(() => {
        if (selectAll) {
            setSelectedRows([]);
            rowsRef.current.forEach((ele) => {
                setSelectedRows((oldSelectedRows) => [...oldSelectedRows, ele.id]);
            });
        } else {
            setSelectedRows([]);
        }
    }, [selectAll]);

    const handleRowSelection = async (id) => {
        if (selectedRef.current.includes(id)) {
            let currentSelection = selectedRef.current.filter((item) => item !== id);
            await setSelectAll(false);
            setSelectedRows(currentSelection);
        } else {
            if (rowsRef.current.length === selectedRef.current.length + 1) {
                setSelectAll(true);
            } else {
                setSelectedRows((oldSelectedRows) => [...oldSelectedRows, id]);
            }
        }
    };

    const handleDeleteClose = (result) => {
        setDeleteOpen(false);
        if (result)
            selectedRef.current.forEach((id) => {
                onDelete(id);
            });
    };

    const renderCard = useCallback((row, idx, selected) => {
        return (
            <PlayerTagRow
                row={row}
                onPlay={() => onPlay({ row, idx })}
                selected={idx === selected}
                onClick={(e) => handleRowClick({ row, idx })}
                key={row.id}
                index={idx}
                id={row.id}
                moveRow={moveRow}
                handleRowSelection={handleRowSelection}
                checked={selectedRef.current.includes(row.id)}
            />
        );
    }, []);

    return (
        <Box {...params}>
            <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', p: 0.5 }}>
                <h5 style={{ textAlign: 'center' }}>
                    {t('Player')} {t('Tag')}
                </h5>
                <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
                <TableContainer style={{ height: '100%' }}>
                    <DndProvider backend={HTML5Backend}>
                        <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ pb: 4 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} />
                                    </TableCell>
                                    <TableCell align="center">{t('Action')}</TableCell>
                                    <TableCell align="center">{t('ActionType')}</TableCell>
                                    <TableCell align="center">{t('ActionResult')}</TableCell>
                                    <TableCell align="center">{t('Player')}</TableCell>
                                    <TableCell align="center">{t('StartTime')}</TableCell>
                                    <TableCell align="center">{t('EndTime')}</TableCell>
                                    <TableCell align="center">
                                        {!!selectedRef.current.length && (
                                            <IconButton onClick={() => setDeleteOpen(true)} size="small" sx={{ position: 'absolute', top: 4, right: 8 }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{tableRows.map((row, i) => renderCard(row, i, selected))}</TableBody>
                        </Table>
                    </DndProvider>
                </TableContainer>
            </Paper>
        </Box>
    );
}
