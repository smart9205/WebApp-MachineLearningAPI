import {
    ANALYZE_LINE_MESSAGE,
    ANALYZE_LINE_DELETE_SUCCESS,
    ANALYZE_LINE_DELETE_FAIL
  } from "../actions/types";
  
  const initialState = { 
    deleteSuccess: false,
    deleteFail: false,
    message: {},
  };
  
  export default function game(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case ANALYZE_LINE_MESSAGE:
        return {
          ...state,
          message: payload,
        };
      case ANALYZE_LINE_DELETE_SUCCESS:
        return {
          ...state,
          deleteSuccess: !state.deleteSuccess,
        };
      case ANALYZE_LINE_DELETE_FAIL:
        return {
          ...state,
          deleteFail: !state.deleteFail,
        };
      default:
        return state;
    }
  }
  