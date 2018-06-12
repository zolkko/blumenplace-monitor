[@bs.module "./scss/login.css"] external loginCss : string = ""; { let _ = loginCss; };

type state = {
    username: string,
    password: string,
    canSubmit: bool,
};
  
/* Action declaration */
type action =
    | Username(string)
    | Password(string)
    | Toggle;

let component = ReasonReact.reducerComponent("LoginScreen");

let make = (~username: string, _children) => {

    let submit = (_state) => {
        ()
    };

    let isValidUsername = (value) => (value |> String.trim |> String.length) > 4;

    let isValidPassword = (value) => (value |> String.trim |> String.length) > 6;

    let isValidForm = (u, p) => isValidUsername(u) && isValidPassword(p);

    {
        ...component,

        initialState: () => { username: username, password: "", canSubmit: false },

        reducer: (action: action, state: state) => {
            switch (action) {
            | Username(value) => ReasonReact.Update({...state, username: value, canSubmit: isValidForm(value, state.password)})
            | Password(value) => ReasonReact.Update({...state, password: value, canSubmit: isValidForm(state.username, value)})
            | Toggle => ReasonReact.NoUpdate
            }
        },

        render: (self) => {
            <div className="container">
                <div className="wrapper">
                    <form className="form-signin" action="" method="post" name="sign" disabled=( !self.state.canSubmit )>
                        <div className="row text-center bol"><i className="fa fa-circle"></i></div>
                        <h3 className="form-signin-heading text-center"><img src="/img/example.png" alt="" /></h3>
                        <hr className="spartan" />
                        <div className="input-group">
                            <span className="input-group-addon"><i className="fa fa-user"></i></span>
                            <input className="form-control"
                                type_="text"
                                name="username"
                                placeholder="Username"
                                required=true
                                autoFocus=true
                                defaultValue=( self.state.username )
                                onChange={ event => self.send(Username(ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value)) } />
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                            <input className="form-control"
                                type_="password"
                                name="password"
                                placeholder="Password"
                                required=true
                                onChange={ event => self.send(Password(ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value)) } />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block"
                            onClick={ _ => submit(self.state) }
                            name="submit"
                            value="Sign-In"
                            disabled=( !self.state.canSubmit )>( ReasonReact.string("Sign-In") )</button>
                    </form>
                </div>
            </div>
        },
    }
};
