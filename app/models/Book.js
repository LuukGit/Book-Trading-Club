'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Book = new Schema({
    title: String,
    owner: String,
    image: String
});

module.exports = mongoose.model("Book", Book);
