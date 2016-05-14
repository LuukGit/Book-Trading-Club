import React from "react";
import Book from "./Book.jsx";
import ajax from "../common/ajax-functions.js";

class AllBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, books: undefined };
    }

    componentDidMount() {
        ajax("GET", "/books", "", function(data) {
            data = JSON.parse(data);
            this.setState({ books: data });
            ajax("POST", "/user/username", JSON.stringify({ username: this.props.route.user.username }), function(user) {
                user = JSON.parse(user);
                this.setState({ user: user });
            }.bind(this));
        }.bind(this));
    }

    render() {
        if (!this.state.books || !this.state.user) {
            return(
                <div></div>
            );
        }
        else {
            var books = this.state.books.map(function(book, index) {
                return <Book key={index} book={book} user={this.state.user}/>
            }.bind(this));
            return(
                <div id="all-books">
                    <h3> Available Books </h3>
                    <hr></hr>
                    {books}
                </div>
            );
        }
    }
}

module.exports = AllBooks;
