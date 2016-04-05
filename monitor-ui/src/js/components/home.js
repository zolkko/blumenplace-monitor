import React from "react";
import { connect } from "react-redux";
import { signOut, refreshToken } from "../actions";
import { isSignedIn } from "../utils";
import settings from "../settings";


const REFRESH_TIME = 1000 * 5;


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.refreshTimer = null;
    }

    clearRefreshTimer() {
        if (this.refreshTimer != null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    handleTokenRefresh() {
        this.props.refreshToken(this.props.email, this.props.password, this.props.accessToken);
        this.clearRefreshTimer();
    }

    startRefreshTimer(expireAt) {
        let delay = expireAt - _.now() - REFRESH_TIME;
        if (delay < 0) {
            delay = 0;
        }
        this.refreshTimer = setTimeout(this.handleTokenRefresh.bind(this), delay);
    }

    componentWillMount() {
        if (!this.props.isSignedIn) {
            this.context.router.push(settings.signInUrl);
        } else {
            this.startRefreshTimer(this.props.expireAt);
        }
    }

    componentWillUnmount() {
        this.clearRefreshTimer();
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isSignedIn) {
            this.context.router.push(settings.signInUrl);
        } else {
            this.clearRefreshTimer();
            this.startRefreshTimer(nextProps.expireAt);
        }
    }

    handleSignOut(event) {
        event.preventDefault();
        this.props.signOut();
        return false;
    }

    render() {
        return (
            <div>
                <h1>The Home Page</h1>
                <p><button onClick={this.handleSignOut.bind(this)}>Sign Out</button></p>
            </div>
        );
    }
}

Home.contextTypes = {
    router: React.PropTypes.object
};

const mapStateToProps = function (state, ownProps) {
    let credentials = state.user.credentials;
    return {
        email: credentials.email,
        password: credentials.password,
        accessToken: credentials.accessToken,
        expireAt: credentials.expireAt,
        isSignedIn: isSignedIn(credentials.accessToken, credentials.expireAt)
    };
};

export default connect(mapStateToProps, {
    signOut: signOut,
    refreshToken: refreshToken
})(Home);
