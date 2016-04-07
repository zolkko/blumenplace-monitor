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
            passwordValid: true,
            displayErrors: true
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
            passwordValid: checkPasswordValid(nextProps.password),
            displayErrors: true
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

    prepareErrorMessages() {
        if (this.props.error !== null && _.isObject(this.props.error)) {
            return _.map(this.props.error, function (error, title) {
                return (
                    <ul key="errorList" className="list">
                        <li key={title}>{ error }</li>
                    </ul>
                );
            });
        } else {
            return (<p key="errorText">{ this.props.error }</p>);
        }
    }

    handleMessageClose() {
        this.setState({ displayErrors: false });
    }

    prepareErrors() {
        if (this.props.error == null || (_.isString(this.props.error) && this.props.error.length === 0)) {
            return null;
        }

        return (
            <div className="ui error message" style={ this.state.displayErrors ? {} : {display: "none"} }>
                    <i className="close icon" onClick={this.handleMessageClose.bind(this)}></i>
                    <div className="header">sign-in failed</div>
                    {this.prepareErrorMessages()}
            </div>
        );
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
