import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { updateProfile } from "../../actions/auth";
import { SET_MESSAGE, CLEAR_MESSAGE } from "../../actions/types";

const EditProfile = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [country, setCountry] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setFirstname(currentUser.first_name);
    setLastname(currentUser.last_name);
    setPhonenumber(currentUser.phone);
    setCountry(currentUser.country);
  }, [currentUser]);

  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
           This field is required!
        </div>
      );
    }
  };

  const vfirstname = (value) => {
    if (value.length < 1 || value.length > 30) {
      return (
        <div className="alert alert-danger" role="alert">
          The first name must be between 1 and 30 characters.
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
    setFirstname(e.target.value);
  };

  const onChangeLastname = (e) => {
    setLastname(e.target.value);
  };
  const onChangePhonenumber = (e) => {
    setPhonenumber(e.target.value);
  };

  const onChangeCountry = (e) => {
    setCountry(e.target.value);
  };

  const clearMessage = (v) => {
    if (v.length)
      dispatch({
        type: CLEAR_MESSAGE,
      });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (newPassword !== confirmPassword) {
      setSuccessful(false);
      dispatch({
        type: SET_MESSAGE,
        payload: "Confirm Password not matches",
      });
      return;
    }

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(updateProfile(oldPassword, newPassword, firstname, lastname, phonenumber, country))
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
      <div className="card card-container">
        <Form onSubmit={handleSaveProfile} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="oldpassword">Old Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="oldpassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newpassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearMessage(e.target.value);
                  }}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="confirmpassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearMessage(e.target.value);
                  }}
                  validations={[required]}
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

              <div className="form-group">
                <button className="btn btn-primary btn-block">
                  Save Profile</button>
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

export default EditProfile;
