import axios from "axios";
import { APIBASEURL, SECRET } from "../config/settings"
import authHeader from "./auth-header";
import CryptoJS from 'crypto-js'

const API_URL = `${APIBASEURL}/api/auth/`;

const register = (email, first_name, last_name, phone_number, country) => {
  return axios.post(API_URL + "signup", {
    email: email.toLowerCase(),
    first_name,
    last_name,
    phone_number,
    country
  });
};

const updateProfile = (old_password, new_password, first_name, last_name, phone_number, country) => {
  return axios.post(API_URL + "updateprofile", {
    old_password,
    new_password,
    first_name,
    last_name,
    phone_number,
    country
  },{headers: authHeader()});
};

const verification = (verificationCode) => {
  return axios
    .post(API_URL + "verification", {
      verificationCode
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET).toString());
      }
      return response.data;
    });
};

const login = (email, password, device) => {

  return axios
    .post(API_URL + "signin", {
      email: email.toLowerCase(),
      password,
      device
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET).toString());
      }
      return response.data;
    });
};

const forgetpassword = (email) => {
  return axios.post(API_URL + "forgetpassword", { email: email.toLowerCase() })
};

const resetPwdVerify = (verificationCode) => {
  return axios
  .post(API_URL + "resetPwdVerify", {
    verificationCode
  })
  .then((response) => {
    return response;
  });
};

const resetpassword = (userdata, password) => {
  return axios
  .post(API_URL + "resetpassword", {
    id:userdata.id,
    token: userdata.token,
    password
  })
  .then((data) => {
    return data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  updateProfile,
  login,
  logout,
  verification,
  forgetpassword,
  resetPwdVerify,
  resetpassword,
};
export default authService;
