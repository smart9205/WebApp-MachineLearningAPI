import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Input,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import GameService from '../../../services/game.service';
import { getComparator, getFormattedDate, stableSort } from '../../newcoach/components/utilities';
import { USER_IMAGE_DEFAULT } from '../../../common/staticData';
import PasswordDialog from './passwordDialog';
import UserDialog from './userDialog';
import SubscriptionDialog from './subscriptionDialog';

const headCells = [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'country', title: 'Country' },
    { id: 'subscription_name', title: 'Subscription' },
    { id: 'subscription_start', title: 'Subscription Start Date' },
    { id: 'subscription_end', title: 'Subscription End Date' }
];

const AdminUserTab = ({ t }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [alertContent, setAlertContent] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshPage, setRefreshPage] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [userEditMode, setUserEditMode] = useState('Add');
    const [searchText, setSearchText] = useState('');
    const [subscriptionOpen, setSubscriptionOpen] = useState(false);

    const handleDeleteClose = (flag) => {
        setDeleteOpen(false);

        if (flag) {
            GameService.deleteUser(selectedUser.id).then((res) => {
                setAlertContent(res);
                setAlertOpen(true);
                setRefreshPage(!refreshPage);
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (prop) => {
        const isAsc = orderBy === prop && order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(prop);
    };

    const getSortedList = () => {
        return stableSort(
            userList.filter((r) => {
                const name = `${r.first_name} ${r.last_name}`;

                return name.toLowerCase().includes(searchText.toLowerCase());
            }),
            getComparator(order, orderBy)
        ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    useEffect(() => {
        setLoading(true);
        setUserList([]);
        setSelectedUser(null);
        GameService.getAllUsersWithSubscription().then((res) => {
            setUserList(res);
            setLoading(false);
        });
    }, [refreshPage]);

    console.log('admin user =>', userList);

    return (
        <div>
            <div style={{ position: 'absolute', zIndex: 10, padding: 10, display: 'flex' }}>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setUserEditMode('Add');
                        setUserOpen(true);
                    }}
                >
                    {t('Add')} {t('User')}
                </Button>
                <Input sx={{ mx: 10 }} placeholder={t('Search')} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div style={{ width: '100%' }}>
                <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={2000} onClose={() => setAlertOpen(false)}>
                    <Alert onClose={() => setAlertOpen(false)} severity="warning" sx={{ width: '100%' }}>
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
                <PasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} user={selectedUser} />
                <UserDialog open={userOpen} onClose={() => setUserOpen(false)} mode={userEditMode} user={selectedUser} refresh={setRefreshPage} />
                <SubscriptionDialog open={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} user={selectedUser} refresh={setRefreshPage} />
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={userList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
                            <TableHead>
                                <TableRow height="36px">
                                    <TableCell key="image" align="center">
                                        {t('Image')}
                                    </TableCell>
                                    {headCells.map((cell) => (
                                        <TableCell key={cell.id} align="center" sortDirection={orderBy === cell.id ? order : false}>
                                            <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => handleRequestSort(cell.id)}>
                                                {t(cell.title)}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell key="edit" sx={{ width: 100 }} />
                                    <TableCell key="subscription" sx={{ width: 100 }} />
                                    <TableCell key="password" sx={{ width: 100 }} />
                                    <TableCell key="delete" sx={{ width: 70 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <CircularProgress sx={{ my: '30vh' }} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getSortedList().map((item, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                                            <TableCell component="th" id={`enhanced-table-checkbox-${index}`} scope="row" padding="none" align="center">
                                                <img width={40} src={item.user_image ? item.user_image : USER_IMAGE_DEFAULT} alt="User" />
                                            </TableCell>
                                            <TableCell align="center">{item.id}</TableCell>
                                            <TableCell align="center">{`${item.first_name} ${item.last_name}`}</TableCell>
                                            <TableCell align="center">{item.email}</TableCell>
                                            <TableCell align="center">{item.country}</TableCell>
                                            <TableCell align="center">{item.subscription_name}</TableCell>
                                            <TableCell align="center">{getFormattedDate(item.subscription_start)}</TableCell>
                                            <TableCell align="center">{getFormattedDate(item.subscription_end)}</TableCell>
                                            <TableCell align="center" sx={{ width: 100 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setUserEditMode('Edit');
                                                        setUserOpen(true);
                                                    }}
                                                >
                                                    {t('Edit')}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 100 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setSubscriptionOpen(true);
                                                    }}
                                                >
                                                    Subscription
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 100 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setPasswordOpen(true);
                                                    }}
                                                >
                                                    {t('Password')}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 70 }}>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setDeleteOpen(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

export default AdminUserTab;
