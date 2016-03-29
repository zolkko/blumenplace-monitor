import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from "react-router";

import NotFound from "./components/notfound";
import Users from "./components/users";
import User from "./components/user";
import App from "./components/app";

console.log("rendering component");

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="users" component={Users}>
                <Route path="/user/:userId" component={User}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
), document.getElementById("app"));
