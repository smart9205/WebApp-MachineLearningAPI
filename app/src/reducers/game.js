import {
  UPDATE_COUNT
} from "../actions/types";

const initialState = { 
  updateCnt:0, 
};

export default function game(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case UPDATE_COUNT:
      return {
        ...state,
        updateCnt: state.updateCnt + 1,
      };
    default:
      return state;
  }
}
