import React from "react";
import ajax from "../common/ajax-functions.js";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, fullName: "", city: "", state: "" };
        this.handleFullName = this.handleFullName.bind(this);
        this.handleCity = this.handleCity.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetProfile = this.resetProfile.bind(this);
    }

    componentDidMount() {
        this.setState({ user: this.props.route.user });
    }

    handleFullName(e) {
        this.setState({ fullName: e.target.value });
    }

    handleCity(e) {
        this.setState({ city: e.target.value });
    }

    handleState(e) {
        this.setState({ state: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        var user = this.state.user;
        var update = false;
        if (this.state.fullName !== "") {
            user.fullname = this.state.fullName;
            update = true;
        }
        if (this.state.city !== "") {
            user.city = this.state.city;
            update = true;
        }
        if (this.state.state !== "") {
            user.state = this.state.state;
            update = true;
        }
        if (update) {
            ajax("POST", "/update/user", JSON.stringify({ user: user }), function(data) {
                data = JSON.parse(data);
                if (data === "success") {
                    this.setState({ fullName: "", city: "", state: "" });
                }
                else {
                    alert("Something went wrong! Please try again.");
                }
            }.bind(this));
        }
    }

    resetProfile(e) {
        e.preventDefault();
        var user = this.state.user;
        user.fullname = user.city = user.state = "";
        ajax("POST", "/update/user", JSON.stringify({ user: user }), function(data) {
            data = JSON.parse(data);
            if (data === "success") {
                this.setState({ user: user });
            }
            else {
                alert("Something went wrong! Please try again.");
            }
        }.bind(this));
    }

    render() {
        return(
            <div id="profile">
                <div id="update-profile">
                    <form>
                        <label for="fullname">Full Name</label>
                        <input name="fullname" type="text" value={this.state.fullName} onChange={this.handleFullName}></input>
                        <label for="city">City</label>
                        <input name="city" type="text" value={this.state.city} onChange={this.handleCity}></input>
                        <label for="state">State</label>
                        <input name="state" type="text" value={this.state.state} onChange={this.handleState}></input>
                        <div id="profile-buttons">
                            <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                            <button className="btn btn-danger" onClick={this.resetProfile}>Reset Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

module.exports = Profile;
