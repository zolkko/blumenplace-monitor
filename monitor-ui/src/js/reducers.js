import { combineReducers } from "redux";
import {
    SIGNING_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_OUT
} from "actions";


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

function userReducer(state = initialUser, action) {
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
    user: userReducer
});

export default monitorApp;
