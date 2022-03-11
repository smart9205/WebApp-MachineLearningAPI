import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Paper from '@mui/material/Paper';

export default function DragableIndividualTagTable({
  rows,
  offenseTeam,
  updateTagList,
  onPlay,
  ...params
}) {
  const [selectedRow, setSelectedRow] = useState(rows[0])

  useEffect(() => {
    setSelectedRow(rows[0])
  }, [rows])

  return (
    <Box {...params}>
      <Paper sx={{ width: '100%', height: "100%", overflow: 'hidden', p: 0.5 }}>
        <h5 style={{ textAlign: 'center' }}>Player Tag</h5>
        <TableContainer style={{ height: "100%" }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    selected={selectedRow?.id === row.id}
                  >
                    <TableCell align="center">{row.action_name}</TableCell>
                    <TableCell align="center">{row.action_type_name}</TableCell>
                    <TableCell align="center">{row.action_result_name}</TableCell>
                    <TableCell align="center">{row?.player_name}</TableCell>
                    <TableCell align="center">{row?.start_time}</TableCell>
                    <TableCell align="center">{row?.end_time}</TableCell>
                    <TableCell align="center" sx={{ p: 0, m: 0 }}>
                      <IconButton size="small" onClick={() => { onPlay(row); setSelectedRow(row) }}>
                        <PlayCircleIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box >
  );
}
