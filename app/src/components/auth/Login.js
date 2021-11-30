import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@mui/styles';
import { Redirect, useParams, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { isEmail } from "validator";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import randomString from 'randomstring'
import CryptoJS from 'crypto-js'
import { SECRET } from "../../config/settings"

import { login, logout, verification } from "../../actions/auth";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    // backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    textAlign: 'center'
  },
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
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();

  const params = useParams();

  const [cookies, setCookie] = useCookies(['data']);

  if(!Object.keys(cookies).length){
    const data = {device : randomString.generate(16), createDate: new Date()}
    setCookie('data', CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString());
  }
    

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const { isLoggedIn, user:currentUser } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);
  const { lang } = useSelector(state => state.lang);

  const dispatch = useDispatch();

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.match(/\/verification\//) !== null) {
      dispatch(verification(params.code))
        .then((data) => {
          // Here we receive verification succeess 
          console.log("Verfication Data", data);
          window.top.location.replace(`https://${data.lang ? data.lang : "www"}.Stats2Win.net${data.lang ? "/analyzer" : ""}`);
        })
        .catch(() => {
          console.log("error");
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

      let device = null;
      try{
        device = JSON.parse(CryptoJS.AES.decrypt(cookies.data, SECRET).toString(CryptoJS.enc.Utf8)).device;
      }
      catch {
        console.log("JSON Parse error!");
        // make a new string and store in cookie
        device = randomString.generate(16);
        const data = {device : device, createDate: new Date()}
        setCookie('data', CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString());
      }

      dispatch(login(email, password, device))
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
    return window.top.location.replace("https://stats2win.net");
  };

  if (isLoggedIn) {
    const path = localStorage.getItem("path");
    if (currentUser.subscription !== null && currentUser.subscription.available) {
      if(!currentUser.roles.includes("ROLE_SUPERADMIN") && path === '/arbitrage'){
        if(!adminOpen) setAdminOpen(true);
      }
      else {
        console.log("Redirect after login", path);
        return <Redirect to={path ? path : '/calculator'} />;
      }
    }
    if(!open) handleOpen();
  }
  const adminDialogClose = () => {
    localStorage.removeItem("path");
    setAdminOpen(false);
  }

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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{lang.lg_label_subscription_expired || "Subscription expired"}</h2>
            <p id="transition-modal-description">{lang.lg_label_purchase_subscription || "Please purchase subscrition."}</p>
            <Button variant="contained" color="default" className={classes.button} onClick={()=>handleClose()}>
              {lang.ca_label_ok || "OK"}
            </Button>
          </div>
        </Fade>
      </Modal>

      <Dialog
        open={adminOpen}
        onClose={() => adminDialogClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Super Admin Page"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"This is Super Admin page, you are not super admin."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => adminDialogClose()} autoFocus>
            {lang.ca_label_ok || 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="email">{lang.lg_label_email || "Email"}</label>
            <Input
              type="text"
              className="form-control"
              name="email"
              value={email}
              onChange={onChangeEmail}
              validations={[required, validEmail]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{lang.lg_label_password || "Password"}</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>{lang.lg_button_login || "Login"}</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <div className="form-group">
            <Link to={"/forgetpassword"} className="nav-link">
              {lang.lg_a_forgetpassword || "Forgot password?"}
            </Link>
          </div>
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Login;
