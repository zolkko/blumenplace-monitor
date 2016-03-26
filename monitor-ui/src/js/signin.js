require("./../scss/signin.scss");

import App from "./signinapp";


var currentApp;


document.addEventListener("DOMContentLoaded", () => {
  if (!currentApp) {
    currentApp = new App().initialize();
  }
}, false);
