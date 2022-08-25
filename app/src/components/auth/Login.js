import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { isEmail } from 'validator';
import { useTranslation } from 'react-i18next';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import randomString from 'randomstring';
import CryptoJS from 'crypto-js';
import { SECRET } from '../../config/settings';

import { login, logout, verification } from '../../actions/auth';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: '#FFF',
        border: '2px solid #000',
        zIndex: 100,
        // boxShadow: theme.shadows[5],
        padding: 10,
        textAlign: 'center'
    }
}));

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};
const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};
const Login = (props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const form = useRef();
    const checkBtn = useRef();

    const params = useParams();

    const [cookies, setCookie] = useCookies(['data']);

    if (!Object.keys(cookies).length) {
        const data = { device: randomString.generate(16), createDate: new Date() };
        setCookie('data', CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString());
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.match(/\/verification\//) !== null) {
            dispatch(verification(params.code)).then((data) => {
                // Here we receive verification succeess
                window.location.replace('https://soccer.scouting4u.com');
                // window.location.replace(`https://${data.lang ? data.lang : "www"}.Stats2Win.net${data.lang ? "/analyzer" : ""}`);
            });
        }
    }, [params.code, dispatch]);

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password, ''))
                .then(() => {
                    // props.history.push("/profile");
                    // window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    const [open, setOpen] = React.useState(false);

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        logOut();
        return <Navigate to={'/'} />;
    };

    if (isLoggedIn) {
        if (currentUser.subscription.length || currentUser.roles.includes('ROLE_ADMIN')) {
            if (currentUser.roles.includes('ROLE_ADMIN')) return <Navigate to="/admin" />;
            else if (currentUser.roles.includes('ROLE_COACH')) return <Navigate to="/coach" />;
            else return <Navigate to="/" />;
        }
        if (!open) handleOpen();
    }
    const adminDialogClose = () => {
        setAdminOpen(false);
    };

    return (
        <div className="col-md-12">
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Subscription expired</h2>
                        <p id="transition-modal-description">Please purchase subscrition.</p>
                        <Button variant="contained" className={classes.button} onClick={() => handleClose()}>
                            OK
                        </Button>
                    </div>
                </Fade>
            </Modal>

            <Dialog open={adminOpen} onClose={() => adminDialogClose()} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Super Admin Page'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{'This is Super Admin page, you are not super admin.'}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => adminDialogClose()} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="card card-container bg-dark">
                <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />

                <Form onSubmit={handleLogin} ref={form}>
                    <div className="form-group">
                        <label htmlFor="email">{t('Email')}</label>
                        <Input type="text" className="form-control" name="email" value={email} onChange={onChangeEmail} validations={[required, validEmail]} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t('Password')}</label>
                        <Input type="password" className="form-control" name="password" value={password} onChange={onChangePassword} validations={[required]} />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary btn-block" disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm"></span>}
                            <span>{t('Login')}</span>
                        </button>
                    </div>

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={'/forgetpassword'}>{t('ForgotPassword')}</Link>
                        <Link to={'/register'}>{t('Register')}</Link>
                    </div>
                    <CheckButton style={{ display: 'none' }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Login;
