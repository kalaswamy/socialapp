const express = require("express");
const path = require("path");
const process = require("process");
const hbs = require("express-handlebars");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');

var routes = require('./routes/index');

var port = process.env.PORT || 5000;
var GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "PASSWORD";

var app = express();

// view engine setup
app.engine("hbs", hbs({extname: "hbs",
                       defaultLayout: "main",
                       layoutsDir: path.join(__dirname , "../client/views/layouts")}));
app.set("views", path.join(__dirname, "../client/views"));
app.set("view engine", "hbs");

app.set("GMAIL_PASSWORD", GMAIL_PASSWORD);


// Set the routes for the static files for both relative and direct paths
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../client')));

// Set the bodyparser to process post requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Validator from the npm sample
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/', routes);

app.listen(port, () => {
    console.log("listening to the port " + port);
})

module.exports = app;