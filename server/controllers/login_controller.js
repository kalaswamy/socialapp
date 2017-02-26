const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
    init()
    {
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            User.findById(id).then((user)=> {done(null, user)})
                             .catch((error)=> {done(error, null)});
        });

        passport.use(new LocalStrategy((username, password, done) => {
            User.findByCredentials(username, password)
                .then((user) => {done(null, user);})
                .catch((error) => {done(null, false, {message : "Incorrect username or password"});});
        }));
    },

    index(req, res, next) {
       res.render('login', { login_active: 'true' });
    },

    authenticate(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.render('login', {errors : [{msg: "incorrect username or password."}]}); }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                //user.username
                return res.redirect('/index');
            });
        })(req, res, next);
    }
};