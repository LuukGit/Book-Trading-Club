var request = require("request");
var BookUser = require("../models/BookUser.js");
var Book = require("../models/Book.js");
var path = process.cwd();

module.exports = function(app) {
    app.route(["/", "/allbooks", "/mybooks", "/mytrades", "/login", "/profile"])
        .get(function(req, res) {
            res.sendFile(path + '/client/index.html');
        });

    app.route("/login")
        .post(function(req, res) {
            var username = req.body.username;
            var password = req.body.password;
            BookUser.findOne({username: username}, function(err, user) {
                if (err) { throw err; }
                if (user) {
                    if (user.password === password) {
                        res.json(user);
                    }
                    else {
                        res.json("invalid password");
                    }
                }
                else {
                    res.json("invalid username");
                }
            })
        });

    app.route("/user/token")
        .post(function(req, res) {
            BookUser.findOne({token: req.body.token}, function(err, user) {
                if (err) { throw err; }
                if (user !== null) {
                    res.json(user);
                }
                else {
                    res.json("bad token");
                }
            });
        });

    app.route("/user/username")
        .post(function(req, res) {
            BookUser.findOne({username: req.body.username}, function(err, user) {
                if (err) { throw err; }
                if (user !== null) {
                    res.json(user);
                }
                else {
                    res.json("bad username");
                }
            });
        });

    app.route("/add/user")
        .post(function(req, res) {
            var newUser = new BookUser();
            newUser.username = req.body.username;
            newUser.password = req.body.password;
            BookUser.findOne({username: newUser.username}, function(err, user) {
                if (err) { throw err; }
                if (user) {
                    res.json("existing username");
                }
                else {
                    newUser.token = Math.random().toString(36).substring(2,15);
                    newUser.fullname = newUser.city = newUser.state = "";
                    newUser.save(function(err) {
                        if (err) { throw err; }
                        res.json(newUser);
                    });
                }
            });
        });

    app.route("/update/user")
        .post(function(req, res) {
            var user = req.body.user;
            var conditions = {username: user.username}
                , update = {$set: { fullname: user.fullname, city: user.city, state: user.state }}
                , options = { multi: false };
            BookUser.update(conditions, update, options, function(err) {
                if (err) { throw err; }
                else {
                    res.json("success");
                }
            });
        });

    app.route("/add/book/:title")
        .post(function(req, res) {
            var user = req.body.user;
            var url = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + req.params.title + "&maxResults=1&printType=books";
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    if (data.totalItems === 0) {
                        res.json("invalid title");
                    }
                    else {
                        data = data.items[0].volumeInfo;
                        var newBook = new Book();
                        newBook.title = data.title;
                        newBook.owner = user.username;
                        if (data.hasOwnProperty("imageLinks")) {
                            newBook.image = data.imageLinks.thumbnail;
                        }
                        var books = user.books;
                        books.push(newBook);
                        var conditions = { username: user.username }
                            , update = {$set: { books: books }}
                            , options = { multi: false };
                        BookUser.update(conditions, update, options, function(err) {
                            if (err) { throw err; }
                            newBook.save(function(err) {
                                if (err) { throw err; }
                                user.books = books;
                                res.json(user);
                            });
                        });
                    }
                }
            });
        });

    app.route("/remove/book")
        .post(function(req, res) {
            var book = req.body.book;
            var user = req.body.user;
            Book.findOneAndRemove({ title: book.title, owner: book.owner }, function(err, book) {
                if (err) { throw err; }
                var books = user.books;
                var index = books.indexOf(book);
                books.splice(index, 1);
                var conditions = {username: user.username}
                    , update = {$set: { books: books }}
                    , options = { multi: false };
                BookUser.update(conditions, update, options, function(err) {
                    if (err) { throw err; }
                    user.books = books;
                    res.json(user);
                })
            });
        });

    app.route("/books")
        .get(function(req, res) {
            Book.find({}, function(err, books) {
                if (err) { throw err; }
                res.json(books);
            });
        });

    app.route("/add/trade")
        .post(function(req, res) {
            var user = req.body.user;
            var owner = req.body.owner;
            var book = req.body.book;

            var requests_sent = user.requests_sent;
            requests_sent.push(book);
            var requests_received = owner.requests_received;
            requests_received.push({ book: book, user: user.username} );

            var conditions = {username: user.username}
                , update = {$set: { requests_sent: requests_sent }}
                , options = { multi: false };
            BookUser.update(conditions, update, options, function(err) {
                if (err) { throw err; }
                else {
                    conditions = {username: owner.username}
                        , update = {$set: { requests_received: requests_received }}
                        , options = { multi: false };
                    BookUser.update(conditions, update, options, function(err) {
                        if (err) { throw err; }
                        else {
                            owner.requests_received = requests_received;
                            user.requests_sent = requests_sent;
                            res.json({owner: owner, user: user});
                        }
                    });
                }
            });
        });

    app.route("/trade/deny")
        .post(function(req, res) {
            var book = req.body.request.book;
            var sender = req.body.request.user;
            var user = req.body.user;
            var conditions, update, options;
            var requests_received = user.requests_received;
            var index = -1;
            for (var i = 0; i < requests_received.length; i++) {
                if (requests_received[i].book.title === book.title
                        && requests_received[i].book.owner === book.owner
                            && requests_received[i].user === sender) {
                    index = i;
                    break;
                }
            }
            requests_received.splice(index, 1);
            conditions = {username: user.username}
                , update = {$set: { requests_received: requests_received }}
                , options = { multi: false };
            BookUser.update(conditions, update, options, function(err) {
                if (err) { throw err; }
                BookUser.findOne({ username: sender }, function(err, data) {
                    if (err) { throw err; }
                    var requests_sent = data.requests_sent;
                    var index = -1;
                    for (var j = 0; j < requests_sent.length; j++) {
                        if (requests_sent[j].title === book.title
                                && requests_sent[j].owner === book.owner ) {
                            index = j;
                            break;
                        }
                    }
                    requests_sent.splice(index, 1);
                    var conditions = {username: data.username}
                        , update = {$set: { requests_sent: requests_sent }}
                        , options = { multi: false };

                    BookUser.update(conditions, update, options, function(err) {
                        if (err) { throw err; }
                        user.requests_received = requests_received;
                        res.json(user);
                    });
                });
            });
        });

    app.route("/trade/accept")
        .post(function(req, res) {
            var book = req.body.request.book;
            var sender = req.body.request.user;
            var user = req.body.user;
            Book.remove({ title: book.title, owner: book.owner }, function(err){
                if (err) { throw err; }
                var requests_received = user.requests_received;
                var index = -1;
                for (var i = 0; i < requests_received.length; i++) {
                    if (requests_received[i].book.title === book.title
                            && requests_received[i].book.owner === book.owner
                                && requests_received[i].user === sender) {
                        index = i;
                        break;
                    }
                }
                requests_received.splice(index, 1);
                var requests_accepted = user.requests_accepted;
                requests_accepted.push(book);
                var books = user.books;
                for (i = 0; i < books.length; i++) {
                    if (books[i].title === book.title
                            && books[i].owner === book.owner) {
                        index = i;
                        break;
                    }
                }
                books.splice(index, 1);
                var conditions = {username: user.username}
                    , update = {$set: { requests_accepted: requests_accepted, requests_received: requests_received, books: books }}
                    , options = { multi: false };
                BookUser.update(conditions, update, options, function(err) {
                    if (err) { throw err; }
                    BookUser.findOne({ username: sender }, function(err, data) {
                        if (err) { throw err; }
                        var requests_sent = data.requests_sent;
                        var index = -1;
                        for (var j = 0; j < requests_sent.length; j++) {
                            if (requests_sent[j].title === book.title
                                    && requests_sent[j].owner === book.owner ) {
                                index = j;
                                break;
                            }
                        }
                        requests_sent.splice(index, 1);
                        requests_accepted = data.requests_accepted;
                        requests_accepted.push(book);
                        var conditions = {username: data.username}
                            , update = {$set: { requests_sent: requests_sent, requests_accepted: requests_accepted }}
                            , options = { multi: false };
                        BookUser.update(conditions, update, options, function(err) {
                            if (err) { throw err; }
                            user.requests_received = requests_received;
                            res.json(user);
                        });
                    });
                });
            });
        });

    app.route("/trade/cancel")
        .post(function(req, res) {
            var book = req.body.request;
            var owner = req.body.request.owner;
            var user = req.body.user;
            var conditions, update, options;

            var requests_sent = user.requests_sent;
            var index = requests_sent.indexOf(book);
            requests_sent.splice(index, 1);

            conditions = {username: user.username}
                , update = {$set: { requests_sent: requests_sent }}
                , options = { multi: false };

            BookUser.update(conditions, update, options, function(err) {
                if (err) { throw err; }
                BookUser.findOne({ username: owner }, function(err, data) {
                    if (err) { throw err; }
                    var requests_received = data.requests_received;
                    index = requests_received.indexOf(book);
                    requests_received.splice(index, 1);
                    var conditions = {username: data.username}
                        , update = {$set: { requests_received: requests_received }}
                        , options = { multi: false };

                    BookUser.update(conditions, update, options, function(err) {
                        if (err) { throw err; }
                        user.requests_sent = requests_sent;
                        res.json(user);
                    });
                });
            });
        });

    app.route("/trade/remove")
        .post(function(req, res) {
            var user = req.body.user;
            var book = req.body.request;
            var requests_accepted = user.requests_accepted;
            var index = requests_accepted.indexOf(book);
            requests_accepted.splice(index, 1);
            var conditions = {username: user.username}
                , update = {$set: { requests_accepted: requests_accepted }}
                , options = { multi: false };
            BookUser.update(conditions, update, options, function(err) {
                if(err) { throw err; }
                res.json(user);
            });
        });

    app.route("/*")
		.get(function (req, res) {
			res.redirect("/");
		});
}
