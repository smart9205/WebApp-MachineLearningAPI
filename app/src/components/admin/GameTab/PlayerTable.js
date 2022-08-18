import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import { visuallyHidden } from '@mui/utils';
import GameService from '../../../services/game.service';

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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
            id: 'jersey_number',
            numeric: true,
            disablePadding: true,
            label: t('Number')
        },
        {
            id: 'f_name',
            numeric: true,
            disablePadding: true,
            label: t('Name')
        },
        {
            id: 'position',
            numeric: true,
            disablePadding: true,
            label: t('Position')
        },
        {
            id: 'delete',
            numeric: true,
            disablePadding: true,
            label: ''
        }
    ];
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = (props) => {
    const { numSelected, t } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} {t('Selected')}
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    {t('Players')}
                </Typography>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

function EnhancedTable({ jerseyUpdatedCallBack, rows, deletePlayerCallBack, t }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [openEdit, setOpenEdit] = React.useState(0);
    const [editJersey, setEditJersey] = React.useState(0);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const updateJersey = (f_name, l_name) => {
        GameService.updateJersey({ id: openEdit, jersey: Number(editJersey) }).then((data) => {
            jerseyUpdatedCallBack();
        });
        setOpenEdit(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', height: '100%' }}>
                <EnhancedTableToolbar numSelected={selected.length} t={t} />
                <TableContainer style={{ height: 'calc(90vh - 330px)' }}>
                    <Table
                        stickyHeader
                        // sx={{ minWidth: 450 }}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            t={t}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected}>
                                        <TableCell align="center">
                                            {openEdit === row.id ? (
                                                <Input
                                                    sx={{ maxWidth: 60 }}
                                                    type="number"
                                                    value={editJersey}
                                                    onChange={(e) => setEditJersey(e.target.value)}
                                                    onBlur={(e) => updateJersey(row.f_name, row.l_name)}
                                                    onKeyPress={(ev) => {
                                                        if (ev.key === 'Enter') {
                                                            ev.preventDefault();
                                                            updateJersey(row.f_name, row.l_name);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    onClick={(e) => {
                                                        setOpenEdit(row.id);
                                                        setEditJersey(row.jersey_number);
                                                    }}
                                                >
                                                    {row.jersey_number}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.position_name}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => deletePlayerCallBack(row.team_player_id)} sx={{ padding: 0 }}>
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

export default React.memo(EnhancedTable);
