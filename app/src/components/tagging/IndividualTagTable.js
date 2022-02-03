import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Paper from '@mui/material/Paper';
import TCellTimeEdit from './TCellTimeEdit';
import TCellSelectEdit from './TCellSelectEdit';
import GameService from '../../services/game.service';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteConfirmDialog from '../../common/DeleteConfirmDialog';

export default function IndividualTagTable({
  rows,
  offenseTeamId,
  offenseTeam,
  updateTagList,
  defenseTeam = null,
  del = true,
  onPlay,
  ...params
}) {
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(rows[0])
  const [actions, setActions] = useState([])
  const [actionTypes, setActionTypes] = useState([])
  const [actionResults, setActionResults] = useState([])

  useEffect(() => {
    GameService.getAllActions().then((res) => {
      setActions(res)
    });
    GameService.getAllActionTypes().then((res) => {
      setActionTypes(res)
    });
    GameService.getAllActionResults().then((res) => {
      setActionResults(res)
    });
  }, [])

  useEffect(() => {
    setSelectedRow(rows[0])
  }, [rows])

  const handleDeleteClose = (result) => {
    setDeleteOpen(false);

    if (!result) return;

    deletePlayerTag(selectedRow.id)
  };

  const update = (data) => {
    setLoading(true)
    GameService.updatePlayerTag(data).then(res => {
      updateTagList()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const deletePlayerTag = (id) => {
    setLoading(true)
    GameService.deletePlayerTag(id).then(res => {
      updateTagList()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <Box {...params}>
      <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
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
              {loading ?
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow> :
                <>
                  {rows.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        selected={selectedRow?.id === row.id}
                      >
                        <TCellSelectEdit
                          rows={actions}
                          value={{ id: row.action_id, name: row.action_name }}
                          update={v => update({ ...row, action_id: v })}
                        />
                        <TCellSelectEdit
                          rows={actionTypes}
                          value={{ id: row.action_type_id, name: row.action_type_name }}
                          update={v => update({ ...row, action_type_id: v })}
                        />
                        <TCellSelectEdit
                          rows={actionResults}
                          value={{ id: row.action_result_id, name: row.action_result_name }}
                          update={v => update({ ...row, action_result_id: v })}
                        />
                        <TCellSelectEdit
                          rows={row.team_id === offenseTeamId ? offenseTeam : defenseTeam}
                          value={{ id: row.player_id, name: `${row.player_fname} ${row.player_lname}` }}
                          update={v => update({ ...row, player_id: v })}
                        />
                        <TCellTimeEdit
                          value={row.start_time}
                          update={v => update({ ...row, start_time: v })}
                          end={row.end_time}
                        />
                        <TCellTimeEdit
                          value={row.end_time}
                          update={v => update({ ...row, end_time: v })}
                          start={row.start_time}
                        />

                        <TableCell align="center" sx={{ p: 0, m: 0 }}>
                          {del ?
                            < IconButton size="small" onClick={() => { setDeleteOpen(true); setSelectedRow(row) }}>
                              <DeleteIcon />
                            </IconButton> :
                            <IconButton size="small" onClick={() => { onPlay(row); setSelectedRow(row) }}>
                              <PlayCircleIcon />
                            </IconButton>
                          }

                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box >
  );
}
