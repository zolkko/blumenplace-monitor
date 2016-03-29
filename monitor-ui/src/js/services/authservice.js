import axios from "axios";
import settings from "settings";


const EMAIL_KEY = "email";
const PASSWORD_KEY = "password";


const TOKENS_URL = "v1/api/tokens";


class AuthService {
    constructor() {
        super();
        this.http = axios.create({
            baseURL: settings.apiUrl,
            timeout: 1000,
        });
        this.token = "";
    }

    get isSigned() {
        return !!sessionStore.getItem(EMAIL_KEY)
            && !!sessionStore.getItem(PASSWORD_KEY);
    }

    signout(current_token) {
        sessionStore.setItem(EMAIL_KEY, null);
        sessionStore.setItem(PASSWORD_KEY, null);
        window.location.assign(settings.signinUrl);
        return this;
    }

    signin(email, password) {
        return axios.post(TOKENS_URL, {
            email: email,
            password: password
        }).then((response) => {
            let respData = JSON.parse(response.data);
            if (respData.authToken) {
                this.token = respData.authToken;
            }
        }).catch(() => {
            window.location.assign(settings.signinUrl);
        });
    }
}
