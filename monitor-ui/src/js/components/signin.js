import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { signIn } from "../actions";
import SignInField from "./signin-field";
import {
    checkEmailValid, checkPasswordValid, isSignedIn
} from "../utils";


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
import "semantic-ui/message.css";
import "signin.scss";


class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailValid: true,
            password: "",
            passwordValid: true
        };
    }

    componentWillMount() {
        if (checkEmailValid(this.props.email) && checkPasswordValid(this.props.password)) {
            this.props.signIn(this.props.email, this.props.password);
        }

        this.setState({
            email: this.props.email,
            password: this.props.password
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            email: nextProps.email,
            emailValid: checkEmailValid(nextProps.email),
            password: nextProps.password,
            passwordValid: checkPasswordValid(nextProps.password)
        });

        if (nextProps.isSignedIn) {
            this.context.router.push("/");
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    onSignIn(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        this.props.signIn(this.state.email, this.state.password);
        return false;
    }

    handleEmailChange(email) {
        this.setState({
            email: email,
            emailValid: checkEmailValid(email)
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password: password,
            passwordValid: checkPasswordValid(password)
        });
    }

    prepareErrors() {
        if (this.props.error !== null && _.isObject(this.props.error)) {
            return (
                <div className="ui error message">
                    <div className="header">sign-in failed</div>
                    {_.map(this.props.error, function (error, title) {
                        return (<p key={title}>{ error }</p>);
                    })}
                </div>
            );
        } else if (_.isString(this.props.error) && this.props.error.length > 0) {
            return (
                <div className="ui error message">
                    <div className="header">sign-in failed</div>
                    <p>{ this.props.error }</p>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        let errors = this.prepareErrors();

        return (
            <div className="ui middle aligned center aligned grid main-grid">
                <div className="row" style={{height: "20%"}}></div>
                <div className="row" style={{height: "50%"}}>
                    <div className="column six wide">
                        <div className="ui left aligned grid">
                            <div className="column sixteen wide center aligned"><h1>blumenplace monitor</h1></div>
                            <div className="column sixteen wide">

                                { errors }
                                <div className={this.props.isLoading ? "ui loading form segment" : "ui form segment"}>
                                    <SignInField name="email" label="Email"
                                        inputType="text" icon="user" placeholder="e-mail"
                                        value={this.state.email}
                                        isValid={this.state.emailValid}
                                        onChange={this.handleEmailChange.bind(this)} />
                                    <SignInField
                                        name="password" label="Password" inputType="password" icon="lock"
                                        value={this.state.password}
                                        isValid={this.state.passwordValid}
                                        onChange={this.handlePasswordChange.bind(this)} />
                                    <button onClick={this.onSignIn.bind(this)}
                                        className="ui blue submit button">Sign-In</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{height: "30%"}}></div>
            </div>
        );
    }
};

SignIn.contextTypes = {
    router: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
    let credentials = state.user.credentials;
    return {
        isLoading: state.user.isLoading,
        isSignedIn: isSignedIn(credentials.accessToken, credentials.expireAt),
        error: state.user.error,
        email: state.user.credentials.email,
        password: state.user.credentials.password
    };
};

const mapDispatchToProps = {
    signIn: signIn
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
