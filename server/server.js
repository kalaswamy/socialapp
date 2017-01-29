const express = require("express");
const path = require("path");
const process = require("process");



var port = process.env.PORT || 5000;

var app = express();
app.use('/static', express.static(path.join(__dirname, 'client')))

app.get("/", (req, res) => {
    res.send("<!doctype html> <html> <head></head> <body><p>Hello World....</p></body></html>");
})

app.listen(port, () => {
    console.log("listening to the port " + port);
})

module.exports = app;