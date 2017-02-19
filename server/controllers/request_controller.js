const Contact = require('../models/contact');

module.exports = {

    index(req, res, next) {
       let req1;
       Contact.find({})
       .then((contacts) => 
       {
           req1 = contacts;
           console.log(req1);
           res.render('request', { request_active: 'true', requests: req1});
       })
    }
};