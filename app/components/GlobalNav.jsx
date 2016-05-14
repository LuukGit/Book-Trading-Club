import React from "react";
import { Link } from "react-router";

class GlobalNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined };
  }

  componentDidMount() {
      this.setState({ user: this.props.user });
  }

  render() {
    var log = <li><Link to="/login"> Login </Link></li>;
    if (this.state.user) {
        var profileName = this.state.user.username.charAt(0).toUpperCase() + this.state.user.username.substr(1, this.state.user.username.length);
        log = <li><Link to="/profile"> {profileName} </Link></li>;
    }

    return (
      <nav id="myNav" className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header"> <h3 className="navbar-text">Book Trading App</h3> </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/allbooks">All Books</Link>
            </li>
            <li>
              <Link to="/mybooks">My Books</Link>
            </li>
            <li>
              <Link to="/mytrades">My Trades</Link>
            </li>
            {log}
          </ul>
        </div>
      </nav>
    );
  }
}

module.exports = GlobalNav;
