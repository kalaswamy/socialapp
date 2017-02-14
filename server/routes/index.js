const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
var app = express();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { index_active: 'true' });
});

router.get('/index', (req, res) => {
  res.render('index', { index_active: 'true' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { contact_active: 'true' });
});

router.get('/login', (req, res) => {
  res.render('login', { login_active: 'true' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { signup_active: 'true' });
});


router.post("/login", (req, res) => {
    res.redirect('/index');
});

router.post("/contact", (req, res) => {
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email - ' +  req.body.email + ' is not valid.').isEmail();
    req.checkBody('message','Message field is required').notEmpty();

    req.getValidationResult().then((error) => {
        var pwd = req.app.get("GMAIL_PASSWORD");

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

	        transporter.sendMail(mailOptions, function(error, info){
		         if(error){
			         console.log(error);
			         res.render('contact');
		         } else {
			         console.log('Message Sent: '+info.response);
			         res.redirect('/index');
		         }
	        });
        }
    });
});

router.post("/signup", (req, res) => {
    res.redirect('/index');
});

module.exports = router;