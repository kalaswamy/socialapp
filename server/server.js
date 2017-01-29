const express = require("express");
const path = require("path");
const process = require("process");



var port = process.env.port || 3000;

var app = express();
app.use('/static', express.static(path.join(__dirname, 'client')))

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log("listening to the port " + port);
})

module.exports = app;