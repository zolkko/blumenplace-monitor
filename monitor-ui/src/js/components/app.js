import React from "react";
import { Link } from "react-router";
import { connect } from "react-redux";


export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        return this.props.children;
    }
}

App.contextTypes = {
    router: React.PropTypes.object
};
