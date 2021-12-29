import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import GameService from '../../services/game.service';

export default function StickyHeadTable({rows, updateTagList, handleRowClick}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRowId, setSelectedRowId] = React.useState(rows[0]?.id);

  React.useEffect(() => {
    setSelectedRowId(rows[0]?.id)
  }, [rows])

  React.useEffect(() => {
    handleRowClick(selectedRowId); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowId])
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteTag = (id) => {
    GameService.deleteTeamTag(id).then(res => {
      updateTagList()
    })
  }
  return (
    <Box sx={{ width: '100%', p: 1 }}>

      <Paper sx={{ width: '100%', overflow: 'hidden', p: 1 }}>
        <h5>Team Tag</h5>
        <TableContainer style={{ height: "calc(60vh - 100px)" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell>Offensive Team</TableCell>
                <TableCell>Defensive Team</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                      selected={row.id === selectedRowId}
                      onClick={() => setSelectedRowId(row.id)}
                      >
                      <TableCell align="center">{row.offensive_team_name}</TableCell>
                        <TableCell align="center">{row.defensive_team_name}</TableCell>
                        <TableCell align="center">{row.start_time}</TableCell>
                        <TableCell align="center">{row.end_time}</TableCell>
                        <TableCell align="center" sx={{p:0}}>
                          <IconButton onClick={() => deleteTag(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
