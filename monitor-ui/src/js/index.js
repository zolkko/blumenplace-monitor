import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, IndexRoute, Route, Link, browserHistory } from "react-router";

import store from "./store";

import App from "./components/app";
import Home from "./components/home";
import SignIn from "./components/signin";
import NotFound from "./components/notfound";

import "less/app.less";
import "scss/signin.scss";


render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="signin" component={SignIn}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Router>
    </Provider>
), document.getElementById("app"));
