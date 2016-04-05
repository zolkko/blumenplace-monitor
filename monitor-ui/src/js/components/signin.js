import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { signIn } from "../actions";
import SignInField from "./signin-field";
import {
    checkEmailValid, checkPasswordValid, isSignedIn
} from "../utils";


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
                    <div className="header">Error</div>
                    {_.map(this.props.error, function (error, title) {
                        return (<p key={title}>{ error }</p>);
                    })}
                </div>
            );
        } else if (_.isString(this.props.error) && this.props.error.length > 0) {
            return (
                <div className="ui error message">
                    <div className="header">Error</div>
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
            <div className="main-container">
                <div className="form-container">
                    <form action="#" method="post">
                        <div className={this.props.isLoading ? "ui loading form segment" : "ui form segment"}>
                            { errors }
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
                    </form>
                </div>
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
