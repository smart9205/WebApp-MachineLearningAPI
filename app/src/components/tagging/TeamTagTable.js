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
import DeleteConfirmDialog from '../../common/DeleteConfirmDialog';
import TCellSelectEdit from './TCellSelectEdit';

const PERIOD = [
    { id: 1, name: '1st Half' },
    { id: 2, name: '2nd Half' },
    { id: 3, name: 'Overtime' }
];

export default function TeamTagTable({ rows, updateTagList, handleRowClick, selectedId, onPlay, ...params }) {
    const [loading, setLoading] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleDeleteClose = (result) => {
        setDeleteOpen(false);

        if (!result) return;

        deleteTag(selectedIndex);
    };

    const deleteTag = (id) => {
        setLoading(true);
        GameService.deleteTeamTag(id)
            .then((res) => {
                updateTagList();
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const update = (v) => {
        setLoading(true);
        GameService.updateTeamTag(v)
            .then((res) => {
                updateTagList();
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <Box {...params}>
            <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
            <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', p: 0.5 }}>
                <h5 style={{ textAlign: 'center' }}>Team Tag</h5>
                <TableContainer style={{ height: '100%' }}>
                    <Table stickyHeader aria-label="sticky table" size={'small'} sx={{ pb: 4 }}>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {rows.map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id} selected={row.id === selectedId}>
                                                <TCellSelectEdit
                                                    rows={PERIOD}
                                                    value={PERIOD.find((p) => p.id === row.period)}
                                                    update={(v) => {
                                                        update({ ...row, period: v });
                                                    }}
                                                />
                                                <TableCell align="center" onClick={() => handleRowClick(row)}>
                                                    {row.offensive_team_name}
                                                </TableCell>
                                                <TableCell align="center" onClick={() => handleRowClick(row)}>
                                                    {row.defensive_team_name}
                                                </TableCell>
                                                <TCellTimeEdit value={row.start_time} update={(v) => update({ ...row, start_time: v })} end={row.end_time} />
                                                <TCellTimeEdit value={row.end_time} update={(v) => update({ ...row, end_time: v })} start={row.start_time} />
                                                <TableCell align="center" sx={{ p: 0, m: 0 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedIndex(row.id);
                                                            setDeleteOpen(true);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
