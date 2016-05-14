'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookUser = new Schema({
    username: String,
    password: String,
    token: String,
    fullname: String,
    city: String,
    state: String,
    books: [],
    requests_sent: [],
    requests_received: [],
    requests_accepted: []
});

module.exports = mongoose.model("BookUser", BookUser);
