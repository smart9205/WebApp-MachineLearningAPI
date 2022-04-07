import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import { isEmail } from "validator";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { forgetpassword, resetPwdVerify, resetpassword } from "../../actions/auth";

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  link: {
    color: '#007bff',
    '&:hover': {
      color: "#5d6e81",
      cursor: 'pointer'
    },
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

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const BackToLogin = (props) => {
  const classes = useStyles();

  const clicked = (e) => {
    window.location.replace("https://soccer.scouting4u.com");
  };
  return (
    <div className={classes.link} onClick={clicked} >Back to Login</div>
  );
}

const SendEmail = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const dispatch = useDispatch();

  const handleForgetPassword = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(forgetpassword(email))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  return (
    <Form onSubmit={handleForgetPassword} ref={form}>
      <h3>Forget Password</h3>
      <div className="form-group">
        <label htmlFor="email">Email</label>
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
        <button className="btn btn-primary btn-block">
          <span>Submit</span>
        </button>
      </div>

      {message && (
        <div className="form-group">
          <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
            {message}
          </div>
        </div>
      )}
      <div className="form-group">
        <Link to={"/login"} className="nav-link">
          Back to Login
        </Link>
      </div>
      <CheckButton style={{ display: "none" }} ref={checkBtn} />
    </Form>
  );
}



const ResetPWD = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const { userdata } = useSelector(state => state.resetpwd);

  const dispatch = useDispatch();

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const onChangeConfirmPassword = (e) => {
    const password = e.target.value;
    setConfirmPassword(password);
  };


  const handleResetPassword = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(resetpassword(userdata, password, confirmPassword))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  return (
    <Form onSubmit={handleResetPassword} ref={form}>
      <h3>Reset Password</h3>
      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <Input
          type="password"
          className="form-control"
          name="password"
          value={password}
          onChange={onChangePassword}
          validations={[required, vpassword]}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Confirm Password</label>
        <Input
          type="password"
          className="form-control"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          validations={[required]}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary btn-block">
          <span>Reset</span>
        </button>
      </div>

      {message && (
        <div className="form-group">
          <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
            {message}
          </div>
        </div>
      )}
      <div className="form-group">
        <BackToLogin />
      </div>
      <CheckButton style={{ display: "none" }} ref={checkBtn} />
    </Form>
  );
}

const ForgetPassword = (props) => {
  const params = useParams();

  const [verifySuccess, setVerifySuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.match(/\/resetPwdVerify\//) !== null) {
      dispatch(resetPwdVerify(params.code))
        .then(() => {
          setVerifySuccess(true);
        })
        .catch(() => {
          setVerifySuccess(false);
        });
    }
  }, [params.code, dispatch]);

  return (
    <div className="col-md-12">
      <div className="card card-container bg-dark">
        {!verifySuccess ? (
          <SendEmail />
        ) : (
          <ResetPWD />
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
