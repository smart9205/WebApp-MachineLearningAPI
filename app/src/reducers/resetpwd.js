import { RESET_PWD_READY } from "../actions/types";

const initialState = {};

export default function resetpwd(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RESET_PWD_READY:
      return { userdata: payload };

      default:
      return state;
  }
}
