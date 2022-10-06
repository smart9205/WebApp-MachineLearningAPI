import { UPDATE_CORRECTION_COUNT, UPDATE_COUNT } from './types';

import GameService from '../services/game.service';

export const getFormulas = (analyze_game_id) => (dispatch) => {
    return GameService.getFormulas(analyze_game_id).then(
        (data) => {
            dispatch({
                type: UPDATE_COUNT,
                payload: data
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

export const getCorrectionCount = () => (dispatch) => {
    return GameService.getCorrectionRequest()
        .then((res) => {
            dispatch({ type: UPDATE_CORRECTION_COUNT, payload: res.length });

            return Promise.resolve();
        })
        .catch((e) => {
            return Promise.reject();
        });
};
