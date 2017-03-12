const User = require('../models/user');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
const nodeMailerClient = require("../library/nodemailwrapper");

module.exports = {
    index(req, res, next) {
       User.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
           if (!user) {
               req.flash('error', 'Password reset token is invalid or has expired.');
               return res.render('forgot', {errors: [{msg:"Password reset token is invalid or has expired."}]});
           }
           res.render('reset'); 
       });
    },
    create(req, res, next) {
        async.waterfall([
               function(done) {
                    User.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                        if (!user) {
                            req.flash('error', 'Password reset token is invalid or has expired.');
                            return res.render('forgot', {errors: [{msg:"Password reset token is invalid or has expired."}]});
                        }

                        user.password = req.body.password;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
              },
              function(user, done) {
                  nodeMailerClient.sendMail(user.email,
                                            'Your password has been changed',
                                            'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                  );
                  done(null);
             }
             ], function(err) {
                   res.redirect('/');
            });

        }
}