import React from "react";
import { Link } from "react-router";
import { NavDropdown, MenuItem } from "react-bootstrap";

class GlobalNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined };
    this.logout = this.logout.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }

  componentDidMount() {
      this.setState({ user: this.props.user });
  }

  goToProfile() {
      window.location.href = "http://127.0.0.1:8080/profile";
  }

  logout() {
      sessionStorage.removeItem("_book_token");
      window.location.href = window.location.href + "/";
  }

  render() {
      if (this.state.user) {
            var profileName = this.state.user.username.charAt(0).toUpperCase() + this.state.user.username.substr(1, this.state.user.username.length);
            return (
              <nav id="myNav" className="navbar navbar-default">
                <div className="container-fluid">
                  <div className="navbar-header"> <h3 className="navbar-text">Book Trading App</h3> </div>
                  <ul className="nav navbar-nav navbar-right">
                    <li className="navbar-li">
                      <Link to="/allbooks">All Books</Link>
                    </li>
                    <li className="navbar-li">
                      <Link to="/mybooks">My Books</Link>
                    </li>
                    <li className="navbar-li">
                      <Link to="/mytrades">My Trades</Link>
                    </li>
                    <NavDropdown className="navbar-li" title={profileName} id="nav-dropdown">
                              <MenuItem className="menu-item" onClick={this.goToProfile}>Settings</MenuItem>
                              <MenuItem className="menu-item" onClick={this.logout}>Logout</MenuItem>
                    </NavDropdown>
                  </ul>
                </div>
              </nav>
            );
        }
        else {
            return(
                <nav id="myNav" className="navbar navbar-default">
                  <div className="container-fluid">
                    <div className="navbar-header"> <h3 className="navbar-text">Book Trading App</h3> </div>
                    <ul className="nav navbar-nav navbar-right">
                      <li className="navbar-li">
                          <Link to="/login"> Login </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
            );
        }
    }
}

module.exports = GlobalNav;
