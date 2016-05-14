import React from "react";
import ReactDOM from "react-dom";
import { browserHistory, Router, Route, IndexRoute } from "react-router";
import Main from "./components/Main.jsx";
import AllBooks from "./components/AllBooks.jsx";
import MyBooks from "./components/MyBooks.jsx";
import MyTrades from "./components/MyTrades.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import ajax from "./common/ajax-functions";


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {user: undefined, response: false};
      this.setUser = this.setUser.bind(this);
      this.requireLogin = this.requireLogin.bind(this);
      this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        var token;
        if ((token = sessionStorage.getItem("_book_token"))) {
            ajax("POST", "/user/token", JSON.stringify({token: token}), function(data) {
                data = JSON.parse(data);
                if (data !== "bad token") {
                    this.setState({ user: data });
                }
                else {
                    sessionStorage.removeItem("_book_token");
                }
                this.setState({ response: true });
            }.bind(this));
        }
        else {
            this.setState({ response: true });
        }
    }

    setUser(user) {
        sessionStorage.setItem("_book_token", user.token);
        window.location.href = "https://luuk-book-trading-club.herokuapp.com/allbooks";
    }

    updateUser(user) {
        this.setState({ user: user });
    }

    requireLogin(nextState, replaceState) {
      if (!this.state.user) {
        replaceState({ nextPathname: nextState.location.pathname }, '/login');
      }
    }

    render() {
        if(this.state.response) {
          return (
            <Router history={browserHistory}>
              <Route path="/" component={Main} onUpdate={this.updateUser} user={this.state.user}>
                <IndexRoute component={MyBooks} onEnter={this.requireLogin} user={this.state.user}/>
                <Route path="/mybooks" onUpdate={this.updateUser} user={this.state.user} onEnter={this.requireLogin} component={MyBooks} user={this.state.user}/>
                <Route path="/mytrades" user={this.state.user} onEnter={this.requireLogin} component={MyTrades} user={this.state.user}/>
                <Route path="/allbooks" user={this.state.user} onEnter={this.requireLogin} component={AllBooks} user={this.state.user}/>
                <Route path="/profile" user={this.state.user} onEnter={this.requireLogin} component={Profile} user={this.state.user}/>
                <Route path="/login" onLogin={this.setUser} component={Login} />
              </Route>
            </Router>
          );
        }
        else {
          return (
            <div></div>
          );
        }
    }
}

ReactDOM.render((<App />), document.getElementById("app"));
