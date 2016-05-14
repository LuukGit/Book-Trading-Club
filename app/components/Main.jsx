import React from "react";
import GlobalNav from "./GlobalNav.jsx";

class Main extends React.Component {

  render() {
    return (
      <div className="container">
        <GlobalNav user={this.props.route.user}/>
        <div id="content" className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = Main;
