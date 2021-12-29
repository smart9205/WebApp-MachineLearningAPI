import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./CSS/table.css";

export default function StickyHeadTable({ rows, loading }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 1 }}>
        <h5>Team Tag</h5>
        <TableContainer style={{ height: "calc(30vh - 70px)" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Action</TableCell>
                <TableCell align="center">Action Type</TableCell>
                <TableCell align="center">Action Result</TableCell>
                <TableCell align="center">Team</TableCell>
                <TableCell align="center">Player</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">{row.action_name}</TableCell>
                      <TableCell align="center">{row.action_type_name}</TableCell>
                      <TableCell align="center">{row.action_result_name}</TableCell>
                      <TableCell align="center">{row.team_name}</TableCell>
                      <TableCell align="center">{`${row.player_fname} ${row.player_lname}`}</TableCell>
                      <TableCell align="center">{row.start_time}</TableCell>
                      <TableCell align="center">{row.end_time}</TableCell>
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
