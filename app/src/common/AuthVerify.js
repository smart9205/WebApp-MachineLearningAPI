import React, { useEffect } from "react";
import { history } from '../helpers/history';

import CryptoJS from 'crypto-js'
import { SECRET } from "../config/settings"

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  history.listen(() => {
    let user;
    try {
      user = localStorage.getItem("user") ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("user"), SECRET).toString(CryptoJS.enc.Utf8)) : null;
    } catch {
      console.error("loading user error");
    }
    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  });

  return <div></div>;
};

export default AuthVerify;
