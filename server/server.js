const express = require("express");
const path = require("path");
const process = require("process");
const hbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const flash = require('connect-flash');

var routes = require('./routes/index');

var port = process.env.PORT || 5000;
var GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "PASSWORD";
var MONGODB_URI = process.env.MONGODB_URI;

//set the global variable
global.AppRootPath = path.resolve(__dirname, "../");

var app = express();

// setup the mongo db
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;
db.once('open', () => {
  // we're connected!
  console.log("Connected to MongoDb")
});

// setup the application settings - view engine etc ....
app.engine("hbs", hbs({extname: "hbs",
                       defaultLayout: "main",
                       layoutsDir: path.join(__dirname , "../client/views/layouts")}));
app.set("views", path.join(__dirname, "../client/views"));
app.set("view engine", "hbs");
app.set("GMAIL_PASSWORD", GMAIL_PASSWORD);

// ------MIDDLEWARE SETTINGS
// Set the routes for the static files for both relative and direct paths
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/lightbox2/dist')));

app.use(express.static(path.join(__dirname, '../client')));

// Set the bodyparser to process post requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handle Sessions needed for passport
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator from the npm sample for the post request body validation ....
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

// sessions are stored as cookie and needed for the passport module for authentication....
app.use(cookieParser());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// set this local for the view access
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Set the routes for the app endpoints .....
app.use('/', routes);

// catch unknown request path and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('The page is not Found');
  err.status = 404;
  next(err);
});

// The error handler for the app.....
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
});

app.listen(port, () => {
    console.log("listening to the port " + port);
})

module.exports = app;