
const nodemailer = require('nodemailer');
const process = require("process");

module.exports = {
     sendMail(recipient, subject1, content) {
         let pwd = process.env.GMAIL_PASSWORD || "PASSWORD";

         let smtpTransport = nodemailer.createTransport({ service: 'Gmail',
                                                          auth: {
                                                                    user: 'seetharaman.swamy@gmail.com',
                                                                    pass: pwd
                                                                }
                                                        });
         let mailOptions = {
                              to: recipient,
                              //from: 'sswamy <seetharaman.swamy@gmail.com>',
                              from: 'IITALUMNI <seetharaman.swamy@gmail.com>',
                              subject: subject1,
                              text: content
                           };

         console.log("Before sending email");
         smtpTransport.sendMail(mailOptions, (err) => { console.log("After sending email")});
     }
}