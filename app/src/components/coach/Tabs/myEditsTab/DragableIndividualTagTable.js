import React, { useCallback, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PlayerTagRow } from './PlayerTagRow';

export default function DragableIndivitualTagTable({ rows, handleRowClick, selected, onPlay, handleSort, onDelete, ...params }) {
  const [tableRows, setTableRows] = useState(rows)

  useEffect(() => {
    setTableRows(rows)
  }, [rows])

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setTableRows((prevCards) => {
      const newRow = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
      const start = dragIndex < hoverIndex ? dragIndex : hoverIndex;
      const end = (dragIndex > hoverIndex ? dragIndex : hoverIndex) + 1;
      handleSort(newRow.slice(start, end).map((row, i) => { return { ...row, sort: start + i } }))
      return newRow
    });
  }, []);
  const renderCard = useCallback((row, idx, selected) => {
    return (
      <PlayerTagRow
        row={row}
        onPlay={() => onPlay({ row, idx })}
        selected={idx === selected}
        onDelete={onDelete}
        onClick={e => handleRowClick({ row, idx })}
        key={row.id}
        index={idx}
        id={row.id}
        moveRow={moveRow}
      />);
  }, []);

  return (
    <Box {...params}>
      <Paper sx={{ width: '100%', height: "100%", overflow: 'hidden', p: 0.5 }}>
        <h5 style={{ textAlign: 'center' }}>Player Tag</h5>
        <TableContainer style={{ height: "100%" }}>
          <DndProvider backend={HTML5Backend}>
            <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ pb: 4 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Action</TableCell>
                  <TableCell align="center">Action Type</TableCell>
                  <TableCell align="center">Action Result</TableCell>
                  <TableCell align="center">Player</TableCell>
                  <TableCell align="center">Start Time</TableCell>
                  <TableCell align="center">End Time</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row, i) => renderCard(row, i, selected))}
              </TableBody>
            </Table>
          </DndProvider>
        </TableContainer>
      </Paper>
    </Box>
  );
}
