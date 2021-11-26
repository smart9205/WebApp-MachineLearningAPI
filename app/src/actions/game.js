import {
  FORMULA_CHANGED,
  ANALYZE_LINE_MESSAGE,
  ANALYZE_LINE_DELETE_SUCCESS,
  ANALYZE_LINE_DELETE_FAIL,
  WISDOM_CHANGED
} from "./types";

import GameService from "../services/game.service";

export const getFormulas = (analyze_game_id) => (dispatch) => {
  return GameService.getFormulas(analyze_game_id).then(
    (data) => {
      dispatch({
        type: FORMULA_CHANGED,
        payload: data,
      });

      return Promise.resolve();
    },
    (error) => {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();

      // dispatch({
      //   type: LINE_CHANGED,
      // });

      return Promise.reject();
    }
  );
};

export const getWisdomOfCrowd = (filtered_data) => (dispatch) => {
  return GameService.getWisdomOfCrowd(filtered_data).then(
    (data) => {
      console.log("wisdom",data)
      dispatch({
        type: WISDOM_CHANGED,
        payload: data,
      });

      return Promise.resolve();
    },
    (error) => {
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();

      // dispatch({
      //   type: LINE_CHANGED,
      // });

      return Promise.reject();
    }
  );
};

export const deleteAnalyzeLine = (id) => (dispatch) => {
  return GameService.deleteAnalyzeLine(id).then(
    (data) => {
      console.log("action data", data);

      dispatch({
        type: ANALYZE_LINE_DELETE_SUCCESS,
      });

      dispatch({
        type: ANALYZE_LINE_MESSAGE,
        payload: { result: true, data: data.message }
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: ANALYZE_LINE_DELETE_FAIL,
      });
      dispatch({
        type: ANALYZE_LINE_MESSAGE,
        payload: { result: false, data: message }
      });

      return Promise.reject();
    }
  );
};



