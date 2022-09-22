import React, { useEffect, useState } from 'react';
import GameService from '../../../services/game.service';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import CheckIcon from '@mui/icons-material/Check';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/material/Input';
import DeleteConfirmDialog from '../../../common/DeleteConfirmDialog';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import TeamFormDialog from './TeamFormDialog';
const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, t } = props;
    const headCells = [
        {
            id: 'image',
            label: t('Image')
        },
        {
            id: 'id',
            label: t('ID')
        },
        {
            id: 'name',
            label: t('Name')
        },
        {
            id: 'team_color',
            label: `${t('Team')} ${t('Color')}`
        },
        {
            id: 'second_color',
            label: `${t('Second')} ${t('Color')}`
        },
        {
            id: 'create_highlights',
            label: `${t('Create')} ${t('Highlights')}`
        },
        {
            id: 'sponsor_logo',
            label: `${t('Sponsor')} ${t('Logo')}`
        },
        {
            id: 'sponsor_url',
            label: `${t('Sponsor')} ${t('URL')}`
        },
        {
            id: 'show_sponsor',
            label: `${t('Show')} ${t('Sponsor')}`
        }
    ];
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align="center" sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
};

export default function TeamTab({ t }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const handleDeleteClose = (result) => {
        setDeleteOpen(false);

        if (!result || !selected) return;

        GameService.deleteTeam(selected?.id)
            .then((res) => {
                init();
            })
            .catch((e) => {});
    };

    const init = () => {
        setLoading(true);
        setFormOpen(false);
        GameService.getAllTeams()
            .then((res) => {
                setRows(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <DeleteConfirmDialog open={deleteOpen} handleDeleteClose={handleDeleteClose} />
            <TeamFormDialog
                open={formOpen}
                onResult={(res) => {
                    setFormOpen(false);
                    if (res) init();
                }}
                edit={selected}
                t={t}
            />
            <Paper sx={{ width: '100%', mb: 2 }}>
                <div style={{ position: 'absolute', zIndex: 10, padding: 10, display: 'flex' }}>
                    <Button
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                        onClick={() => {
                            setFormOpen(true);
                            setSelected(null);
                        }}
                    >
                        <AddIcon />
                        {t('Add')} {t('Team')}
                    </Button>
                    <Input
                        sx={{ mx: 10 }}
                        placeholder={t('Search')}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <TableContainer>
                    <Table>
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} t={t} />
                        <>
                            {loading ? (
                                <TableBody style={styles.loader}>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {stableSort(
                                        rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
                                        getComparator(order, orderBy)
                                    )
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover key={row.id}>
                                                    <TableCell align="center">
                                                        <img width={40} src={row.image?.length > 0 ? row.image : TEAM_ICON_DEFAULT} alt="Team" />
                                                    </TableCell>
                                                    <TableCell align="center">{row.id}</TableCell>
                                                    <TableCell align="center">{row.name}</TableCell>
                                                    <TableCell align="center">
                                                        <div className="team-theme-color" style={{ backgroundColor: row.team_color }}></div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div className="team-theme-color" style={{ backgroundColor: row.second_color }}></div>
                                                    </TableCell>
                                                    <TableCell align="center">{row.create_highlights && <CheckIcon />}</TableCell>
                                                    <TableCell align="center">
                                                        <img width={40} src={row.sponsor_logo?.length > 0 ? row.sponsor_logo : TEAM_ICON_DEFAULT} alt="Team" />
                                                    </TableCell>
                                                    <TableCell align="center">{row.sponsor_url}</TableCell>
                                                    <TableCell align="center">{row.show_sponsor && <CheckIcon />}</TableCell>
                                                    <TableCell align="center" sx={{ width: 50 }}>
                                                        <IconButton
                                                            onClick={() => {
                                                                setFormOpen(true);
                                                                setSelected(row);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: 50 }}>
                                                        <IconButton
                                                            onClick={() => {
                                                                setSelected(row);
                                                                setDeleteOpen(true);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 33 * emptyRows
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            )}
                        </>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 25]}
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
