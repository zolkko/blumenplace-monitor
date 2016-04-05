import _ from "lodash";


const EMAIL_RE = /.+@.+/;

export function checkEmailValid (email) {
    return _.isString(email) && !!email.match(EMAIL_RE);
}

export function checkPasswordValid(password) {
    return _.isString(password) && password.length > 0;
}

export function isNotExpire (expireAt) {
    return _.isNumber(expireAt) && expireAt > _.now();
}

export function isAccessTokenValid(accessToken) {
    return !!accessToken;
}

export function isSignedIn(accessToken, expireAt) {
    return isAccessTokenValid(accessToken) && isNotExpire(expireAt);
}
