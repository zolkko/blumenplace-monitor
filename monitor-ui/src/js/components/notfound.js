import React from "react";
import { Link } from "react-router";


export class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h1>Not Found</h1>
                <Link to="/">Back to application</Link>
            </div>
        );
    }
}
