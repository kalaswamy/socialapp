const express = require("express");
const path = require("path");
const process = require("process");



var port = process.env.PORT || 5000;

var app = express();

// Set the routes for the static files for both relative and direct paths
app.use(express.static('client'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static('node_modules/bootstrap/dist'));

app.get("/", (req, res) => {
    console.log(" *******came inside ***********")
    console.log (req.path + " " + req.baseUrl);
    //res.send("<!doctype html> <html> <head></head> <body><p>Hello World....</p></body></html>");
})

app.post("/contact", (req, res) => {
    console.log(" *******came inside post ***********")
    console.log (req.path + " " + req.baseUrl);
    res.redirect('/index.html');
    //res.send("<!doctype html> <html> <head></head> <body><p>Hello World....</p></body></html>");
});

app.post("/signup", (req, res) => {
    console.log(" *******came inside post ***********")
    console.log (req.path + " " + req.baseUrl);
    res.redirect('/index.html');
    //res.send("<!doctype html> <html> <head></head> <body><p>Hello World....</p></body></html>");
});

app.post("/login", (req, res) => {
    console.log(" *******came inside post ***********")
    console.log (req.path + " " + req.baseUrl);
    res.redirect('/index.html');
    //res.send("<!doctype html> <html> <head></head> <body><p>Hello World....</p></body></html>");
});

app.listen(port, () => {
    console.log("listening to the port " + port);
})

module.exports = app;