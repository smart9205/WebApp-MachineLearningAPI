import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, UPDATEPROFILE1_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

import { getUser } from '../common/utilities';

const user = getUser();

const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

export default function auth(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user
            };
        case UPDATEPROFILE1_SUCCESS:
            return {
                ...state,
                user: payload.user
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        default:
            return state;
    }
}
