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
import TCellTimeEdit from '../tagging/TCellTimeEdit';
import TCellSelectEdit from '../tagging/TCellSelectEdit';
import GameService from '../../services/game.service';
import CircularProgress from '@mui/material/CircularProgress';

export default function IndividualTagTable({
  rows,
  offenseTeam,
  updateTagList,
  onPlay,
  t,
  ...params
}) {
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState(rows[0])

  useEffect(() => {
    setSelectedRow(rows[0])
  }, [rows])

  const update = (data) => {
    setLoading(true)
    GameService.updatePlayerTag(data).then(res => {
      updateTagList()
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  return (
    <Box {...params}>
      <Paper sx={{ width: '100%', height: "100%", overflow: 'hidden', p: 0.5 }}>
        <h5 style={{ textAlign: 'center' }}>{t("Player")} {t("Tag")}</h5>
        <TableContainer style={{ height: "100%" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ pb: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">{t("Action")}</TableCell>
                <TableCell align="center">{t("ActionType")}</TableCell>
                <TableCell align="center">{t("ActionResult")}</TableCell>
                <TableCell align="center">{t("Player")}</TableCell>
                <TableCell align="center">{t("StartTime")}</TableCell>
                <TableCell align="center">{t("EndTime")}</TableCell>
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
                        <TableCell align="center">{row.action_name}</TableCell>
                        <TableCell align="center">{row.action_type_name}</TableCell>
                        <TableCell align="center">{row.action_result_name}</TableCell>
                        <TCellSelectEdit
                          rows={offenseTeam}
                          value={{ id: row.player_id, name: `${row.player_fname} ${row.player_lname}` }}
                          update={v => {
                            const player = offenseTeam.find(p => p.player_id === v)
                            update({ ...row, player_id: v })
                            row.player_id = v
                            row.player_fname = player.f_name
                            row.player_lname = player.l_name
                          }}
                        />
                        <TCellTimeEdit
                          value={row.start_time}
                          update={v => {
                            update({ ...row, start_time: v })
                            row.start_time = v
                          }}
                          end={row.end_time}
                        />
                        <TCellTimeEdit
                          value={row.end_time}
                          update={v => {
                            update({ ...row, end_time: v })
                            row.end_time = v
                          }}
                          start={row.start_time}
                        />

                        <TableCell align="center" sx={{ p: 0, m: 0 }}>
                          <IconButton size="small" onClick={() => { onPlay(row); setSelectedRow(row) }}>
                            <PlayCircleIcon />
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
    </Box >
  );
}
