import { UPDATE_COUNT, UPDATE_CORRECTION_COUNT } from '../actions/types';

const initialState = {
    updateCnt: 0,
    correctionCnt: 0
};

export default function game(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_COUNT:
            return {
                ...state,
                updateCnt: state.updateCnt + 1
            };

        case UPDATE_CORRECTION_COUNT:
            return {
                ...state,
                correctionCnt: payload
            };

        default:
            return state;
    }
}
