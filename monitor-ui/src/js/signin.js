import "semantic-ui/reset.css";
import "semantic-ui/reset.css";
import "semantic-ui/site.css";
import "semantic-ui/container.css";
import "semantic-ui/grid.css";
import "semantic-ui/header.css";
import "semantic-ui/form.css";
import "semantic-ui/label.css";
import "semantic-ui/input.css";
import "semantic-ui/button.css";
import "semantic-ui/icon.css";
import "signin.scss";

import App from "signinapp";
import React from "react";

var currentApp;

document.addEventListener("DOMContentLoaded", () => {
    if (!currentApp) {
        currentApp = new App().initialize();
    }
}, false);
