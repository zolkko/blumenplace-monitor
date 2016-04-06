import _ from "lodash";
import axios from "axios";
import settings from "./settings";


export const SIGNING_IN = "SIGNING_IN";
export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_IN_FAILED = "SIGN_IN_FAILED";
export const SIGN_OUT = "SIGN_OUT";


const EMAIL_KEY = "EMAIL_KEY";
const PASSWORD_KEY = "PASSWORD_KEY";


function signingIn() {
    return { type: SIGNING_IN };
}

function signInSuccess(email, password, accessToken, expireAt) {
    return {
        type: SIGN_IN_SUCCESS,
        email: email,
        password: password,
        accessToken: accessToken,
        expireAt: expireAt
    };
}

function signInFailed(email, password, error) {
    return {
        type: SIGN_IN_FAILED,
        email: email,
        password: password,
        error: error
    };
}

export function signIn(email, password) {
    return dispatch => {
        window.localStorage.setItem(EMAIL_KEY, "");
        window.localStorage.setItem(PASSWORD_KEY, "");

        dispatch(signingIn());

        return axios.post(settings.tokensUrl, {
            email: email,
            password: password
        }, {
            baseURL: settings.apiUrl,
            timeout: 1000
        }).then(response => {
            if (response.status != 200) {
                dispatch(signInFailed("Failed to sign-in"));
            } else {
                if (_.isObject(response.data) && _.has(response.data, "accessToken") && _.has(response.data, "expireAt")) {
                    window.localStorage.setItem(EMAIL_KEY, email);
                    window.localStorage.setItem(PASSWORD_KEY, password);
                    try {
                        let expireAt = Date.parse(response.data.expireAt);
                        dispatch(signInSuccess(email, password, response.data.accessToken, expireAt));
                    } catch (err) {
                        dispatch(signInFailed(email, password, "Failed to parse expire-at date. Malformed server response."));
                    }
                } else {
                    dispatch(signInFailed("Failed to sign-in. Malformed server response"));
                }
            }
        }).catch(error => {
            if (error instanceof Error) {
                dispatch(signInFailed(email, password, error.message));
            } else {
                dispatch(signInFailed(email, password, error.data.message));
            }
        });
    };
}

export function signOut() {
    window.localStorage.setItem(EMAIL_KEY, "");
    window.localStorage.setItem(PASSWORD_KEY, "");

    return { type: SIGN_OUT };
}

export function refreshToken(email, password, accessToken) {
    return dispatch => {
        let headers = {};
        headers[settings.authTokenHeader] = accessToken;

        return axios.get(settings.tokensUrl, {
            baseURL: settings.apiUrl,
            timeout: 1000,
            headers: headers
        }).then(response => {
            if (_.isObject(response.data) && _.has(response.data, "accessToken") && _.has(response.data, "expireAt")) {
                try {
                    let expireAt = Date.parse(response.data.expireAt);
                    dispatch(signInSuccess(email, password, response.data.accessToken, expireAt));
                } catch (err) {
                    dispatch(signInFailed(email, password, "Faild to parse expire-at date. Malformed server response."));
                }
            } else {
                dispatch(signInFailed(email, password, "Failed to refresh access token. Malformed service response."));
            }
        }).catch(error => {
            if (error instanceof Error) {
                dispatch(signInFailed(email, password, error.message))
            } else {
                dispatch(signInFailed(email, password, error.data.message));
            }
        });
    };
}
