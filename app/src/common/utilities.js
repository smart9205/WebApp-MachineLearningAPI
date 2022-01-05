import CryptoJS from 'crypto-js'
import { SECRET } from "../config/settings"

export function toHHMMSS(data) {
  if (!data || data === "") return "00:00:00"
  let sec_num = parseInt(data, 10); // don't forget the second param
  if (sec_num < 0) sec_num = 0;
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

export function toSecond(data) {
  if (!data || data === "") return 0
  let a = data.split(':'); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}
export function getUser() {
  try {
    const user = localStorage.getItem("user")
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("user"), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return user
  } catch (e) {
    console.error("loading user error");
    return null
  }
}
export function setUser(user) {
  try {
    localStorage.setItem("user", CryptoJS.AES.encrypt(JSON.stringify(user), SECRET).toString());
  } catch (e) {
    console.error("saving user error");
  }
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
