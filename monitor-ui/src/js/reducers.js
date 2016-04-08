import { combineReducers } from "redux";
import {
    APP_INITIALIZED,
    SIGNING_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_OUT, SIGN_IN_RESTORE_EMAIL
} from "constants";


function initializedReducer(state=false, action) {
    switch (action.type) {
        case APP_INITIALIZED:
            return true;

        default:
            return state;
    }
}

const initialUser = {
    isLoading: false,
    error: "",
    credentials: {
        email: "",
        password: "",
        accessToken: "",
        expireAt: null
    }
};

function userReducer(state=initialUser, action) {
    switch (action.type) {
        case SIGNING_IN:
            return Object.assign({}, state, {isLoading: true});

        case SIGN_IN_SUCCESS:
            return {
                isLoading: false,
                error: "",
                credentials: {
                    email: action.email,
                    password: action.password,
                    accessToken: action.accessToken,
                    expireAt: action.expireAt
                }
            };

        case SIGN_IN_FAILED:
            return {
                isLoading: false,
                error: action.error,
                credentials: {
                    email: action.email,
                    password: action.password,
                    accessToken: "",
                    expireAt: null
                }
            };

        case SIGN_IN_RESTORE_EMAIL:
            return {
                isLoading: false,
                error: "",
                credentials: {
                    email: action.email,
                    password: "",
                    accessToken: "",
                    expireAt: null
                }
            };

        case SIGN_OUT:
            return {
                isLoading: false,
                error: "",
                credentials: {
                    email: "",
                    password: "",
                    accessToken: "",
                    expireAt: null
                }
            };

        default:
            return state;
    }
}

const monitorApp = combineReducers({
    initialized: initializedReducer,
    user: userReducer
});

export default monitorApp;
