"use strict";

var http = require("http");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();
var server = http.createServer(app);
var routes = require("./app/routes/index.js");

require("dotenv").load();

mongoose.connect(process.env.MONGO_URI);

app.use("/client", express.static(process.cwd() + "/client"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
