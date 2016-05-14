import React from "react";
import ajax from "../common/ajax-functions.js";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: ""};
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        console.log(props);
    }

    handleUsername(e) {
        this.setState({ username: e.target.value });
    }

    handlePassword(e) {
        this.setState({ password: e.target.value });
    }

    handleLogin(e) {
        e.preventDefault();
        if (this.state.username !== "" && this.state.password !== "") {
            ajax("POST", "/login", JSON.stringify({ username: this.state.username, password: this.state.password }), function(data) {
                console.log(data);
                data = JSON.parse(data);
                if (data === "invalid username" || data === "invalid password") {
                    alert("Invalid username or password.");
                }
                else {
                    this.props.route.onLogin(data);
                }
            }.bind(this));
            this.setState({ username: "", password: ""});
        }
    }

    handleSignup(e) {
        e.preventDefault();
        if (this.state.username !== "" && this.state.password !== "") {
            ajax("POST", "/add/user", JSON.stringify({ username: this.state.username, password: this.state.password }), function(data) {
                data = JSON.parse(data);
                if (data === "existing username") {
                    alert("Username is already in use.");
                }
                else {
                    this.props.route.onLogin(data);
                }
            }.bind(this));
            this.setState({ username: "", password: ""});
        }
    }

    render() {
        return(
            <div id="login">
                <form id="#login-form">
                    <label for="username">Username</label>
                    <input name="username" value={this.state.username} onChange={this.handleUsername} placeholder="Enter username..."></input>
                    <label for="password">Password (<span id="span-warning">warning: stored in plaintext</span>)</label>
                    <input name="password" value={this.state.password} onChange={this.handlePassword} placeholder="Enter password..."></input>
                    <button className="btn btn-info" onClick={this.handleLogin}>Login</button>
                    <button className="btn btn-primary" onClick={this.handleSignup}>Sign up</button>
                </form>
            </div>
        );
    }
}

module.exports = Login;
