import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import resetpwd from "./resetpwd";
import game from "./game";

export default combineReducers({
  auth,
  message,
  resetpwd,
  game,
});
