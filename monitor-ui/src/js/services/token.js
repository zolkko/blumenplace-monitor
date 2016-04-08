import _ from "lodash";
import axios from "axios";
import settings from "settings";


export function signIn(email, password) {
    return new Promise(function (resolve, reject) {
        let payload = {
            email: email,
            password: password
        };

        let options = {
            baseURL: settings.apiUrl,
            timeout: 1000
        };

        axios.post(settings.tokensUrl, payload, options).then(response => {
            let error = null;
            let message = "Failed to sign-in";

            if (response.status == 200 && _.isObject(response.data) && _.has(response.data, "accessToken") && _.has(response.data, "expireAt")) {
                try {
                    let expireAt = Date.parse(response.data.expireAt);
                    return resolve({
                        email: email,
                        password: password,
                        accessToken: response.data.accessToken,
                        expireAt: expireAt
                    });
                } catch (err) {
                    error = response.data;
                    message = "Failed to parse expire-at date. Malformed server response.";
                }
            } else {
                error = response.data;
                message = "Failed to sign-in. Malformed server response";
            }

            reject({
                email: email,
                password: password,
                error: error,
                message: message
            });
        }).catch(error => {
            reject({
                email: email,
                password: password,
                error: error,
                message: (error instanceof Error) ? error.message : error.data.message
            });
        });
    });
}

export function refresh(accessToken) {
    return new Promise(function (resolve, reject) {
        let headers = {};
        headers[settings.authTokenHeader] = accessToken;

        let options = {
            baseURL: settings.apiUrl,
            timeout: 1000,
            headers: headers
        };

        return axios.get(settings.tokensUrl, options).then(response => {
            let message = "Failed to refresh access-token";

            if (response.status == 200 && _.isObject(response.data) && _.has(response.data, "accessToken") && _.has(response.data, "expireAt")) {
                try {
                    let expireAt = Date.parse(response.data.expireAt);
                    return resolve({
                        accessToken: accessToken,
                        expireAt: expireAt
                    });
                } catch (err) {
                    message = "Failed to parse expire-at date. Malformed server response";
                }
            } else {
                message = "Failed to refresh access-token. Malformed service response";
            }

            reject({
                error: response.data,
                message: message
            });
        }).catch(error => {
            reject({
                error: error,
                message: (error instanceof Error) ? error.message : error.data.message
            });
        });
    });
}

export function isNotExpire (expireAt) {
    return _.isNumber(expireAt) && expireAt > _.now();
}

export function isAccessTokenValid(accessToken) {
    return _.isString(accessToken) && accessToken.length > 0;
}

export function isSignedIn(accessToken, expireAt) {
    return isAccessTokenValid(accessToken) && isNotExpire(expireAt);
}
