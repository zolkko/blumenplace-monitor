import _ from "lodash";
import { EMAIL_KEY, PASSWORD_KEY } from "constants";


const EMAIL_RE = /.+@.+/;


export function isEmailValid (email) {
    return _.isString(email) && !!email.match(EMAIL_RE);
}

export function isPasswordValid(password) {
    return _.isString(password) && password.length > 0;
}

export function getEmail() {
    return window.localStorage.getItem(EMAIL_KEY);
}

export function setEmail(email) {
    window.localStorage.setItem(EMAIL_KEY, email);
}

export function getPassword() {
    return window.sessionStorage.getItem(PASSWORD_KEY);
}

export function setPassword(password) {
    window.sessionStorage.setItem(PASSWORD_KEY, password);
}