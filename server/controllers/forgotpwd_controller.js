const User = require('../models/user');
const crypto = require('crypto');
const async = require('async');
const nodeMailerClient = require("../library/nodemailwrapper");

module.exports = {
    index(req, res, next) {
       res.render('forgot');
    },

    create(req, res, next) {
        console.log(req.body);
        req.checkBody('email','Email field is required').notEmpty();
        req.checkBody('email','Email - ' +  req.body.email + ' is not valid.').isEmail();
        let user1 ={};

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('forgot', {errors : error.array()});
            }
            else {
                async.waterfall([
                                function(done) {
                                    crypto.randomBytes(20, function(err, buf) {
                                          var token = buf.toString('hex');
                                          done(err, token);
                                    });
                                },
                                function(token, done) {
                                    User.findOne({ email: req.body.email }, function(err, user) {
                                       if (!user) {
                                          return res.render('forgot', {errors: [{msg:"No account with that " + req.body.email + " email address exists."}]});
                                        }

                                        user.resetPasswordToken = token;
                                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                                        user.save(function(err) {
                                          done(err, token, user);
                                        });
                                     });
                                 },
                                 function(token, user, done) {
                                     nodeMailerClient.sendMail(user.email, 
                                                              'Password Reset',
                                                              'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                                              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                                              'http://' + req.headers.host + '/reset?token=' + token + '\n\n' +
                                                               'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                                                              );
                                     
                                     user1 = user;
                                     done(null, 'done');
                                    
                                 }
                                 ], function(err) {
                                      if (err) return next(err);
                                      console.log("Came Before render")
                                      res.render('forgot', {errors: [{msg:"An e-mail has been sent to " + user1.email +  " with further instructions."}]});
                                 });

                        }
             });
    }
};