import React from "react";
import ajax from "../common/ajax-functions.js";

class MyTrades extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined };
        this.denyRequest = this.denyRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.removeAcceptedRequest = this.removeAcceptedRequest.bind(this);
        this.cancelTrade = this.cancelTrade.bind(this);
    }

    componentDidMount() {
        ajax("POST", "/user/username", JSON.stringify({ username: this.props.route.user.username }), function(data) {
            data = JSON.parse(data);
            if (data !== "bad username") {
                this.setState({ user: data});
            }
        }.bind(this));
    }

    acceptRequest(request) {
        ajax("POST", "/trade/accept", JSON.stringify({ request: request, user: this.state.user }), function(data) {
            if (data) {
                data = JSON.parse(data);
                this.setState({ user: data });
            }
        }.bind(this));
    }

    denyRequest(request) {
        ajax("POST", "/trade/deny", JSON.stringify({ request: request, user: this.state.user }), function(data) {
            if (data) {
                data = JSON.parse(data);
                this.setState({ user: data });
            }
        }.bind(this));
    }

    removeAcceptedRequest(request) {
        ajax("POST", "/trade/remove", JSON.stringify({ request: request, user: this.state.user }), function(data) {
            if (data) {
                data = JSON.parse(data);
                this.setState({ user: data });
            }
        }.bind(this));
    }

    cancelTrade(request) {
        ajax("POST", "/trade/cancel", JSON.stringify({ request: request, user: this.state.user }), function(data) {
            if (data) {
                data = JSON.parse(data);
                this.setState({ user: data });
            }
        }.bind(this));
    }

    render() {
        if (this.state.user) {
            var emptyDiv = <div></div>;
            var requests_accepted = <div></div>;
            var requests_sent = <div></div>;
            var requests_received = <div></div>;
            var accepted = <div></div>;
            var sent = <div></div>;
            var received = <div></div>;
            if (this.state.user.requests_accepted.length === 0 && this.state.user.requests_received.length === 0 && this.state.user.requests_sent.length === 0) {
                emptyDiv = <div id="empty-trade">Nothing to show...</div>;
            }
            else {
                if (this.state.user.requests_accepted.length !== 0) {
                    requests_accepted = this.state.user.requests_accepted.map(function(request, index) {
                        return  <div key={index}>
                                    <img src={request.image} alt={request.title}></img>
                                    <div className="request-info">
                                        <p><strong>Title: </strong> {request.title} </p>
                                        <p><strong>Owner: </strong> {request.owner} </p>
                                    </div>
                                    <button className="btn btn-danger" onClick={() => {this.removeAcceptedRequest(request)}}>Remove</button>
                                </div>;
                    }.bind(this));
                    accepted =  <div id="requests-accepted">
                                    <h4>Accepted: </h4>
                                    {requests_accepted}
                                </div>;
                }
                if (this.state.user.requests_received.length !== 0) {
                    requests_received = this.state.user.requests_received.map(function(request, index) {
                        return  <div key={index}>
                                    <div className="request-info">
                                        <p><strong>Title: </strong> {request.book.title} </p>
                                        <p><strong>Sender: </strong> {request.user} </p>
                                    </div>
                                    <img src={request.book.image} alt={request.book.title}></img>
                                    <div className="request-buttons">
                                        <button className="btn btn-success" onClick={() => {this.acceptRequest(request)}}>Accept</button>
                                        <button className="btn btn-danger" onClick={() => {this.denyRequest(request)}}>Deny</button>
                                    </div>
                                </div>;
                    }.bind(this));
                    received =  <div id="requests-received">
                                    <h4>Received requests: </h4>
                                    {requests_received}
                                </div>;
                }
                if (this.state.user.requests_sent.length !== 0) {
                    requests_sent = this.state.user.requests_sent.map(function(request, index) {
                        return  <div key={index}>
                                    <img src={request.image} alt={request.title}></img>
                                    <div id="cancel-button">
                                        <button className="btn btn-danger" onClick={() => {this.cancelTrade(request)}}>Cancel</button>
                                    </div>
                                </div>;
                    }.bind(this));
                    sent =  <div id="requests-sent">
                                    <h4>Pending trades: </h4>
                                    {requests_sent}
                                </div>;
                }
            }

            return(
                <div id="my-trades">
                    {emptyDiv}
                    {accepted}
                    {received}
                    {sent}
                </div>
            );
        }
        else {
            return(
                <div></div>
            );
        }
    }
}

module.exports = MyTrades;
