import React from "react";
import { Link } from "react-router";


console.log("application rendering");

export class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    return () {
        console.log("application renderer");
        return (
            <div>
                <h1>Application</h1>
                <Link to="/users">Users</Link>
            </div>
        );
    }
}
