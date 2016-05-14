import React from "react";
import ajax from "../common/ajax-functions.js";

class MyBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, title: "" };
        this.handleTitle = this.handleTitle.bind(this);
        this.getBook = this.getBook.bind(this);
        this.removeBook = this.removeBook.bind(this);
    }

    componentDidMount() {
        ajax("POST", "/user/username", JSON.stringify({ username: this.props.route.user.username }), function(data) {
            data = JSON.parse(data);
            if (data !== "bad username") {
                this.setState({ user: data});
            }
        }.bind(this));
    }

    handleTitle(e) {
        this.setState({ title: e.target.value });
    }

    getBook(e) {
        e.preventDefault();
        if (this.state.title !== "") {
            ajax("POST", "/add/book/" + this.state.title, JSON.stringify({ user: this.state.user }), function(data) {
                data = JSON.parse(data);
                if (data !== "invalid title") {
                    this.props.route.onUpdate(data);
                    this.setState({ user: data, title: "" });
                }
                else {
                    alert("Invalid book title. Please try again.");
                }
            }.bind(this));
        }
    }

    removeBook(book) {
        ajax("POST", "/remove/book", JSON.stringify({ book: book, user: this.state.user}), function(data) {
            if (data) {
                data = JSON.parse(data);
                this.props.route.onUpdate(data);
                this.setState({ user: data });
            }
        }.bind(this));
    }

    render() {
        if (this.state.user) {
            var books = this.state.user.books.map(function(book, index) {
                return  <div key={index} className="book">
                            <img src={book.image} alt={book.title}></img>
                            <button className="btn btn-danger" onClick={() => {this.removeBook(book)}}>Remove</button>
                        </div>
            }.bind(this));
            return(
                <div id="my-books">
                    <form>
                        <label for="title">Title</label>
                        <input type="text" placeholder="Enter title..." name="title" value={this.state.title} onChange={this.handleTitle}></input>
                        <button className="btn btn-success" onClick={this.getBook}>Submit</button>
                    </form>
                    <hr></hr>
                    {books}
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

module.exports = MyBooks;
