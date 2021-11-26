import {
  AVERAGES,
  FORMULA_CHANGED,
  FORMULA_FILTERED,
  LINE_CHANGED,
  NDA_CHANGED,
  WISDOM_CHANGED,  
} from "../actions/types";

const initialState = { 
  filtered_data: {}, 
  formulas: [],
  averages: [],
  line:0, 
  nda: true,
  wisdom: {total: 0, upper: 0} 
};

export default function game(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FORMULA_CHANGED:
      return {
        ...state,
        formulas: payload,
      };
    case FORMULA_FILTERED:
      return {
        ...state,
        filtered_data: payload,
      };
    case AVERAGES:
      return {
        ...state,
        averages: payload,
      };
    case LINE_CHANGED:
      return {
        ...state,
        line: payload,
      };
    case NDA_CHANGED:
      return {
        ...state,
        nda: payload,
      };
    case WISDOM_CHANGED:
      return {
        ...state,
        wisdom: payload,
      };
    default:
      return state;
  }
}
