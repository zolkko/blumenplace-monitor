import React from "react";


export default class SignInField extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        let enteredText = event.target.value;
        if (this.props.onChange) {
            this.props.onChange(enteredText);
        }
        return true;
    }

    render() {
        return (
            <div id={this.props.name + "-field"} className={this.props.isValid ? "field" : "field error"}>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <div className="ui left labeled icon input">
                    <input type={this.props.inputType}
                        name={this.props.name}
                        id={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.handleChange.bind(this)} />
                    <i className={this.props.icon + " icon"}></i>
                    <div className="ui corner label">
                        <i className="icon asterisk"></i>
                    </div>
                </div>
            </div>
        );
    }
}

SignInField.propTypes = {
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    inputType: React.PropTypes.string,
    isValid: React.PropTypes.bool,
    onChange: React.PropTypes.func
};

SignInField.defaultProps = {
    name: "input",
    label: "input",
    icon: "user",
    placeholder: "input",
    inputType: "text",
    isValid: true,
    onChange: null
};
