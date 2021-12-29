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

export default function StickyHeadTable({rows, updateTagList, handleRowClick}) {
  const [selectedRowId, setSelectedRowId] = React.useState(rows[0]?.id);

  React.useEffect(() => {
    setSelectedRowId(rows[0]?.id)
  }, [rows])

  React.useEffect(() => {
    handleRowClick(selectedRowId); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowId])
  
  const deleteTag = (id) => {
    GameService.deleteTeamTag(id).then(res => {
      updateTagList()
    })
  }
  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 0.5 }}>
        <h5 style={{textAlign: 'center'}}>Team Tag</h5>
        <TableContainer style={{ height: "calc(60vh - 30px)" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Offensive Team</TableCell>
                <TableCell align="center">Defensive Team</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                      selected={row.id === selectedRowId}
                      onClick={() => setSelectedRowId(row.id)}
                      >
                      <TableCell align="center">{row.offensive_team_name}</TableCell>
                        <TableCell align="center">{row.defensive_team_name}</TableCell>
                        <TableCell align="center">{row.start_time}</TableCell>
                        <TableCell align="center">{row.end_time}</TableCell>
                        <TableCell align="center" sx={{p:0 , m:0}}>
                          <IconButton size="small" onClick={() => deleteTag(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
