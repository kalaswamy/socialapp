const nodemailer = require('nodemailer');
const Contact = require('../models/contact');

module.exports = {

    index(req, res, next) {
       res.render('contact', { contact_active: 'true' });
    },

    create(req, res, next) {
        req.checkBody('name','Name field is required').notEmpty();
        req.checkBody('email','Email field is required').notEmpty();
        req.checkBody('email','Email - ' +  req.body.email + ' is not valid.').isEmail();
        req.checkBody('message','Message field is required').notEmpty();

        req.getValidationResult().then((error) => {
            var pwd = req.app.get("GMAIL_PASSWORD");
            console.log("GMAIL_PASSWORD is " +  pwd);

            if (!error.isEmpty()) {
                res.render('contact', {errors : error.array()});
            }
            else {
                // let us send the email ...
                var transporter = nodemailer.createTransport({
                                        service: 'Gmail',
                                        auth: {
                                                user: 'seetharaman.swamy@gmail.com',
                                                pass: pwd
                                            }
                                });

                var mailOptions = {
                    from: 'sswamy <seetharaman.swamy@gmail.com>',
                    to: 'kala_swamynathan@yahoo.com, shantanataraja@gmail.com',
                    subject: 'IITKharagpur Website Contact Submission',
                    text: 'You have a submission with the following details... Name: '+req.body.name+'Email: '+req.body.email+ 'Message: '+req.body.message,
                    html: '<p>You have a submission with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
                };

                // let us update the db and send Email
                Contact.create({name: req.body.name,
                                email: req.body.email,
                                message: req.body.message})
                .then((contact) => {
                    console.log("Saved successfully to the Db");

                    transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                        res.render('contact');
                    } else {
                        console.log('Message Sent: '+info.response);
                        res.redirect('/index');
                    }
                });


                })
                .catch((error) => {
                    console.log(error);
                });

            }
        });
    },

    read(req, res, next) {
    },

    update(req, res, next) {
    },

    delete(req, res, next) {
    }
};