import * as Token from "services/token";
import * as User from "services/user";
import {
    APP_INITIALIZED,
    SIGNING_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_OUT, SIGN_IN_RESTORE_EMAIL
} from "constants";


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
        User.setEmail("");
        User.setPassword("");

        dispatch(signingIn());

        return Token.signIn(email, password).then(response => {
            User.setEmail(email);
            User.setPassword(password);

            dispatch(signInSuccess(email, password, response.accessToken, response.expireAt));
        }).catch(error => {
            dispatch(signInFailed(email, password, error.message));
        });
    };
}

export function signOut() {
    User.setEmail("");
    User.setPassword("");

    return { type: SIGN_OUT };
}

export function refreshToken(email, password, accessToken) {
    return dispatch => {
        return Token.refresh(accessToken).then(
            (response) => dispatch(signInSuccess(email, password, response.accessToken, response.expireAt)),
            (error) => dispatch(signInFailed(email, password, error.message))
        );
    };
}

export function appInitialized() {
    return { type: APP_INITIALIZED };
}

export function restoreEmail(email) {
    return { type: SIGN_IN_RESTORE_EMAIL, email: email };
}

export function initializeApp() {
    return dispatch => {
        let email = User.getEmail();
        let password = User.getPassword();

        if (User.isEmailValid(email)) {
            if (User.isPasswordValid(password)) {
                dispatch(signIn(email, password)).then(
                    () => dispatch(appInitialized()),
                    () => dispatch(appInitialized())
                );
            } else {
                dispatch(restoreEmail(email));
                dispatch(appInitialized());
            }
        } else {
            dispatch(appInitialized());
        }
    };
}
