import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import GameService from '../../services/game.service';
import TCellTimeEdit from './TCellTimeEdit';

import CircularProgress from '@mui/material/CircularProgress';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function StickyHeadTable({ rows, updateTagList, handleRowClick }) {
  const [selectedRow, setSelectedRow] = React.useState(rows[0]);
  const [loading, setLoading] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    handleRowClick(selectedRow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])


  const handleDeleteClose = (result) => {
    setDeleteOpen(false);

    if (!result) return;

    deleteTag(selectedRow.id)
  };

  const deleteTag = (id) => {
    setLoading(true)
    GameService.deleteTeamTag(id).then(res => {
      updateTagList()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const update = (v) => {
    setLoading(true)
    GameService.updateTeamTag(v).then(res => {
      updateTagList()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 0.5 }}>
        <h5 style={{ textAlign: 'center' }}>Team Tag</h5>
        <TableContainer style={{ height: "calc(60vh - 30px)" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Period</TableCell>
                <TableCell align="center">Offensive Team</TableCell>
                <TableCell align="center">Defensive Team</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ?
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
                :
                <>
                  {rows.map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                        selected={row === selectedRow}
                        onClick={() => setSelectedRow(row)}
                      >
                        <TableCell align="center">
                          {row.period === 1 && "1st Half"}
                          {row.period === 2 && "2st Half"}
                          {row.period === 3 && "Overtime"}
                        </TableCell>
                        <TableCell align="center">{row.offensive_team_name}</TableCell>
                        <TableCell align="center">{row.defensive_team_name}</TableCell>
                        <TCellTimeEdit value={row.start_time} update={v => update({ ...row, start_time: v })} end={row.end_time} />
                        <TCellTimeEdit value={row.end_time} update={v => update({ ...row, end_time: v })} start={row.start_time} />
                        <TableCell align="center" sx={{ p: 0, m: 0 }}>
                          <IconButton size="small" onClick={() => setDeleteOpen(true)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
