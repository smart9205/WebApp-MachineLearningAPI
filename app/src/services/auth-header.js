import CryptoJS from 'crypto-js'
import { SECRET } from "../config/settings"

export default function authHeader() {

  let user;
  try {
    user = localStorage.getItem("user") ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("user"), SECRET).toString(CryptoJS.enc.Utf8)) : null;
  } catch {
    console.error("loading user error");
  }
  
  if (user && user.accessToken) {
    // For Spring Boot back-end
    // return { Authorization: "Bearer " + user.accessToken };

    // for Node.js Express back-end
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}
