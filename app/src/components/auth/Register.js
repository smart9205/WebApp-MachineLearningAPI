import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReCAPTCHA from "react-google-recaptcha";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { register } from "../../actions/auth";



const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [country, setCountry] = useState("");
  const [successful, setSuccessful] = useState(false);

  const [human, setHuman] = useState(false);


  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  // const onChangePassword = (e) => {
  //   const password = e.target.value;
  //   setPassword(password);
  // };
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
          This is not a valid email
        </div>
      );
    }
  };

  const vfirstname = (value) => {
    if (value.length < 1 || value.length > 30) {
      return (
        <div className="alert alert-danger" role="alert">
          The phone number must be between 1 and 30 characters.
        </div>
      );
    }
  };

  const vlastname = (value) => {
    if (value.length < 1 || value.length > 30) {
      return (
        <div className="alert alert-danger" role="alert">
          The last name must be between 1 and 30 characters.
        </div>
      );
    }
  };

  const vphonenumber = (value) => {
    if (value.length < 1 || value.length > 30) {
      return (
        <div className="alert alert-danger" role="alert">
          The phone number must be between 1 and 30 characters.
        </div>
      );
    }
  };

  const vcountry = (value) => {
    if (value.length < 1 || value.length > 30) {
      return (
        <div className="alert alert-danger" role="alert">
          The country must be between 1 and 30 characters.
        </div>
      );
    }
  };

  const onChangeFirstname = (e) => {
    const firstname = e.target.value;
    setFirstname(firstname);
  };

  const onChangeLastname = (e) => {
    const lastname = e.target.value;
    setLastname(lastname);
  };
  const onChangePhonenumber = (e) => {
    const phonenumber = e.target.value;
    setPhonenumber(phonenumber);
  };

  const onChangeCountry = (e) => {
    const country = e.target.value;
    setCountry(country);
  };

  const verifyCaptcha = (res) => {
    if (res) {
      setHuman(true);
    }
  }
  // ReCAPTCHA Expired
  const expireCaptcha = () => {
    setHuman(false);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(email, firstname, lastname, phonenumber, country))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container  bg-dark">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>

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
                <label htmlFor="firstname">First Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="firstname"
                  value={firstname}
                  onChange={onChangeFirstname}
                  validations={[required, vfirstname]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="lastname"
                  value={lastname}
                  onChange={onChangeLastname}
                  validations={[required, vlastname]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <Input
                  type="text"
                  className="form-control"
                  name="phonenumber"
                  value={phonenumber}
                  onChange={onChangePhonenumber}
                  validations={[required, vphonenumber]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <Input
                  type="text"
                  className="form-control"
                  name="country"
                  value={country}
                  onChange={onChangeCountry}
                  validations={[required, vcountry]}
                />
              </div>

              <div>
                <ReCAPTCHA
                  // size="invisible"
                  sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                  onChange={verifyCaptcha}
                  onExpired={expireCaptcha}
                />
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  disabled={!human}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
