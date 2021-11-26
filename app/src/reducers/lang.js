import {
  SET_LANG_SUCCESS,
} from "../actions/types";

const initialState = { 
  lang: {}, 
};

export default function language(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LANG_SUCCESS:
      return {
        ...state,
        lang: payload,
      };
    default:
      return state;
  }
}
