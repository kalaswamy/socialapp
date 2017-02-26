const User = require('../models/user');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       console.log(req.user);

       User.find({group:req.user.group})
       .then((docs) => 
       {
           res.render('member', 
           { 
               member_active: 'true',
               users: docs
           });
       })
       .catch((error) => {
           res.render('member', {errors : [{msg: error.message}]});
       });
    }
}