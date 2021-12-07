import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import resetpwd from "./resetpwd";
import game from "./game";
import userhistory from "./userhistory";

export default combineReducers({
  auth,
  message,
  resetpwd,
  game,
  userhistory,
});
