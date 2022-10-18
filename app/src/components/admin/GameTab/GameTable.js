import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import TagIcon from '@mui/icons-material/Tag';
import { visuallyHidden } from '@mui/utils';
import randomString from 'randomstring';
import GameService from '../../../services/game.service';
import VIDEO_ICON from '../../../assets/video_icon.jpg';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { getComparator, stableSort } from '../../newcoach/components/utilities';

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, t } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const headCells = [
        {
            id: 'image',
            numeric: false,
            disablePadding: true,
            label: t('Image')
        },
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: t('ID')
        },
        {
            id: 'done_tagging',
            numeric: false,
            disablePadding: true,
            label: 'Done Tagging'
        },
        {
            id: 'season_name',
            numeric: false,
            disablePadding: true,
            label: t('Season')
        },
        {
            id: 'league_name',
            numeric: false,
            disablePadding: false,
            label: t('League')
        },
        {
            id: 'home_team_name',
            numeric: false,
            disablePadding: false,
            label: t('HomeTeam')
        },
        {
            id: 'away_team_name',
            numeric: false,
            disablePadding: false,
            label: t('AwayTeam')
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: false,
            label: t('Date')
        },
        {
            id: 'video_url',
            numeric: false,
            disablePadding: false,
            label: t('Video')
        }
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'desc'} onClick={createSortHandler(headCell.id)}>
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default function EnhancedTable({ rows, gameListUpdated, editCallBack, loading, setLoading, search, show_done, t }) {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [selected, setSelected] = React.useState({});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'desc';
        setOrder(isAsc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClose = (result) => {
        setDeleteOpen(false);

        if (!result) return;

        setLoading(true);
        GameService.deleteGame(selected.id).then(
            (res) => {
                if (res.result === 'success') gameListUpdated();
                else {
                    setOpen(true);
                    setAlertContent(res.message);
                    setLoading(false);
                }
            },
            (error) => {
                setOpen(true);
                setAlertContent(error);
                setLoading(false);
            }
        );
    };

    const getSortedList = () => {
        const array = stableSort(
            rows.filter(
                (r) =>
                    r.season_name.toLowerCase().includes(search.toLowerCase()) ||
                    r.league_name.toLowerCase().includes(search.toLowerCase()) ||
                    r.away_team_name.toLowerCase().includes(search.toLowerCase()) ||
                    r.home_team_name.toLowerCase().includes(search.toLowerCase()) ||
                    r.date.slice(0, 10).toString().toLowerCase().includes(search.toLowerCase())
            ),
            getComparator(order, orderBy)
        ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return show_done ? array.filter((item) => !item.done_tagging) : array;
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="warning" sx={{ width: '100%' }}>
                    {alertContent}
                </Alert>
            </Snackbar>
            <Dialog open={deleteOpen} onClose={(e) => handleDeleteClose(false)}>
                <DialogTitle>{t('confirmMsg')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('deleteConformMsg')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => handleDeleteClose(false)}>{t('Close')}</Button>
                    <Button onClick={(e) => handleDeleteClose(true)}>{t('Delete')}</Button>
                </DialogActions>
            </Dialog>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} t={t} />
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress sx={{ my: '30vh' }} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {getSortedList().map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="none" align="center">
                                                    <img width={40} src={row.image?.length > 0 ? row.image : TEAM_ICON_DEFAULT} alt="Team" />
                                                </TableCell>
                                                <TableCell align="center">{row.id}</TableCell>
                                                <TableCell align="center">{row.done_tagging ? 'true' : 'false'}</TableCell>
                                                <TableCell align="center">{row.season_name}</TableCell>
                                                <TableCell align="center">{row.league_name}</TableCell>
                                                <TableCell align="center">
                                                    <Link variant="outlined" to={`/team/${btoa(`${row.home_team_id}|${row.season_id}|${row.league_id}`)}`} target="_blank" rel="noopener noreferrer">
                                                        {row.home_team_name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Link variant="outlined" to={`/team/${btoa(`${row.away_team_id}|${row.season_id}|${row.league_id}`)}`} target="_blank" rel="noopener noreferrer">
                                                        {row.away_team_name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center">{row.date.slice(0, 10)}</TableCell>
                                                <TableCell align="center" sx={{ width: 40 }}>
                                                    <a href={row.video_url} target="_blank" rel="noopener noreferrer">
                                                        <Paper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={3}>
                                                            <img src={VIDEO_ICON} style={{ width: 40, height: 40, borderRadius: 5 }} alt="video" />
                                                        </Paper>
                                                    </a>
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 100 }}>
                                                    <Button variant="outlined" onClick={() => editCallBack(row)} startIcon={<EditIcon />}>
                                                        {t('Edit')}
                                                    </Button>
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 100 }}>
                                                    <Link
                                                        variant="outlined"
                                                        to={`/tagging/${btoa(randomString.generate(3) + row.id + randomString.generate(3))}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="outlined" startIcon={<TagIcon />}>
                                                            {t('Tag')}
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 70 }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setDeleteOpen(true);
                                                            setSelected(row);
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
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
