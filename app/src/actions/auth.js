import {
  SET_LANG_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATEPROFILE_SUCCESS,
  UPDATEPROFILE_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  RESET_PWD_READY,
} from "./types";

import AuthService from "../services/auth.service";

export const getLanguage = (lang) => (dispatch) =>
  AuthService.getLanguage(lang).then(
    (response) => {
      const data = response.data.reduce((obj, item) => {
        return ((obj[item.name] = item.value), obj);
      }, {});

      console.log("getLanguages", data);
      dispatch({
        type: SET_LANG_SUCCESS,
        payload: { ...data, type: lang },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: SET_LANG_SUCCESS,
        payload: { type: lang },
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );

export const register = (email, firstname, lastname, phonenumber, country, lang) => (dispatch) =>
  AuthService.register(email, firstname, lastname, phonenumber, country, lang).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );

export const updateProfile = (oldPassword, newPassword, firstname, lastname, phonenumber, country) => (dispatch) =>
  AuthService.updateProfile(oldPassword, newPassword, firstname, lastname, phonenumber, country).then(
    (response) => {
      dispatch({
        type: UPDATEPROFILE_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: UPDATEPROFILE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );

export const verification = (verificationCode) => (dispatch) =>
  AuthService.verification(verificationCode).then(
    (data) => {
      if (data) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
      }
      return data;
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );
export const login = (email, password, device) => (dispatch) =>
  AuthService.login(email, password, device).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );
export const forgetpassword = (email) => (dispatch) =>
  AuthService.forgetpassword(email).then(
    (response) => {
      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );

export const resetpassword = (userdata, password, confirmPassword) => (dispatch) => {
  if (password !== confirmPassword) {
    dispatch({
      type: SET_MESSAGE,
      payload: "Confirm Password Failed!",
    });
    return Promise.reject();
  }
  return AuthService.resetpassword(userdata, password).then(
    (response) => {
      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );
};

export const resetPwdVerify = (code) => (dispatch) =>
  AuthService.resetPwdVerify(code).then(
    (response) => {
      dispatch({
        type: RESET_PWD_READY,
        payload: response.data,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    },
  );
export const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch({
    type: LOGOUT,
  });
};
