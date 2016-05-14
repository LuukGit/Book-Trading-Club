import React from "react";
import { Modal, Button } from "react-bootstrap";
import ajax from "../common/ajax-functions.js";

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, showModal: false, owner: undefined };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitTrade = this.submitTrade.bind(this);
    }

    componentDidMount() {
        ajax("POST", "/user/username", JSON.stringify({ username: this.props.book.owner }), function(data) {
            data = JSON.parse(data);
            if (data !== "invalid owner") {
                this.setState({ owner: data });
            }
            this.setState({ user: this.props.user });
        }.bind(this));
    }

    openModal() {
        this.setState({ showModal: true });
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    submitTrade() {
        this.setState({ showModal: false });
        var trade_requests = this.state.user.requests_sent;
        var index = -1;
        for (var i = 0; i < trade_requests.length; i++) {
            if (this.props.book.title === trade_requests[i].title
                    && this.props.book.owner === trade_requests[i].owner) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            ajax("POST", "/add/trade", JSON.stringify({ book: this.props.book, user: this.state.user, owner: this.state.owner }), function(data) {
                data = JSON.parse(data);
                if (data !== "invalid trade") {
                    this.setState({ owner: data.owner, user: data.user });
                    alert("Trade successfully added!");
                }
                else {
                    alert("Trade failed. Please reload the page and try again.");
                }
                this.setState({ modal: false });
            }.bind(this));
        }
        else {
            alert("You've already submitted a trade request for this book.");
            this.setState({ modal: false });
        }
    }

    render() {
        var owner = <div></div>;
        var submitTrade = <div></div>;
        if (this.state.owner && this.state.user) {
            if (this.state.owner.username !== this.state.user.username ) {
                var extraInfo = [this.state.owner.fullname, this.state.owner.city, this.state.owner.state];
                for (var i = 0; i < extraInfo.length; i++) {
                    if (extraInfo[i] === "") {
                        extraInfo[i] = "-";
                    }
                }
                owner = <div>
                            <p><span className="span-key">Owner: </span>{this.state.owner.username}</p>
                            <p><span className="span-key">Full Name: </span>{extraInfo[0]}</p>
                            <p><span className="span-key">City </span>{extraInfo[1]}</p>
                            <p><span className="span-key">State: </span>{extraInfo[2]}</p>
                        </div>;
                submitTrade = <Button onClick={this.submitTrade}>Submit trade</Button>;
            }
            else {
                owner = <div>
                            <p><span className="span-own-book">You own this book!</span></p>
                        </div>;
            }

        }

        return(
            <div className="book">
                <input type="image" src={this.props.book.image} alt={this.props.book.title} onClick={this.openModal}></input>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>{this.props.book.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      {owner}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                    {submitTrade}
                  </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = Book;
