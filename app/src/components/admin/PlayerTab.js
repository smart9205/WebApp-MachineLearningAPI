import React, { useEffect, useState, useReducer } from 'react';
import GameService from "../../services/game.service"
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
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/material/Input';
import Upload from '../../common/upload';
import { TEAM_ICON_DEFAULT } from '../../common/staticData';
const styles = {
    loader: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
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
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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

const headCells = [
    {
        id: 'image',
        label: 'Image',
    },
    {
        id: 'f_name',
        label: 'Name',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
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
    orderBy: PropTypes.string.isRequired,
};

const initials = {
    image: "",
    name: ""
}
export default function PlayerTab() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [formOpen, setFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useReducer((old, action) => ({ ...old, ...action }), initials)

    const init = () => {
        setLoading(true)
        setFormOpen(false)
        GameService.getAllPlayers().then((res) => {
            console.log("All Players", res)
            setRows(res)
            setLoading(false)
        }).catch(() => { setLoading(false) })
    }

    useEffect(() => {
        init()
    }, [])

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
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleEditClose = (result) => {
        if (isEdit) {
            console.log("edit", formData)
            GameService.updateTeam(formData).then((res) => {
                console.log("Update result", res)
                init()
            })
        } else {
            GameService.addTeam({ name: formData.name, image: formData.image }).then((res) => {
                console.log("add team", res)
                init()
            })
        }
        setFormOpen(false)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Dialog open={formOpen} onClose={e => handleEditClose(false)}>
                <DialogTitle>{isEdit ? "Edit" : "New"} Team</DialogTitle>
                <DialogContent>
                    <Upload dirName={process.env.REACT_APP_DIR_TEAM} img={formData.image} />
                    <Input
                        fullWidth
                        sx={{ mt: 1 }}
                        placeholder='Team name'
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => handleEditClose(false)}>Cancel</Button>
                    <Button onClick={e => handleEditClose(true)}>Done</Button>
                </DialogActions>
            </Dialog>
            <div style={{ textAlign: "right" }}>
                <IconButton
                    onClick={() => {
                        setFormOpen(true)
                        setIsEdit(false)
                        setFormData(initials)
                    }}>
                    <AddIcon />
                </IconButton>
            </div>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <>{loading ? <TableBody style={styles.loader}>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody> :
                            <TableBody>
                                {stableSort(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
                                    getComparator(order, orderBy)
                                )
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover key={row.id} >
                                                <TableCell align="center">
                                                    <img width={40} src={row.image?.length > 0 ? row.image : TEAM_ICON_DEFAULT} alt='Team' /></TableCell>
                                                <TableCell align="center">{row.f_name} {row.l_name}</TableCell>
                                                <TableCell align="center" sx={{ width: 50 }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setFormOpen(true);
                                                            setIsEdit(true)
                                                            setFormData(row)
                                                        }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 50 }}><IconButton><DeleteIcon /></IconButton></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 33 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        }</>
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
