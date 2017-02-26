const User = require('../models/user');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       res.render('signup', { signup_active: 'true' });
    },

    create(req, res, next) {
        console.log (req.body);
        var profileimage;

        if(req.file){
            console.log('Uploading File...');
            profileimage = req.file.filename;
            profileimage = path.join(util.getUploadedFilePath(), profileimage);
            console.log(profileimage);
        } else {
            console.log('No File Uploaded...');
        }

        req.checkBody('FName','First Name field is required').notEmpty();
        req.checkBody('LName','Last Name field is required').notEmpty();
        req.checkBody('Address','Address field is required').notEmpty();
        req.checkBody('username','UserName field is required').notEmpty();
        req.checkBody('email','Email field is required').notEmpty();
        req.checkBody('email','Email - ' +  req.body.email + ' is not valid.').isEmail();
        req.checkBody('pwd','password field is required').notEmpty();
        req.checkBody('pwd','min 6 characters required').isLength({min: 6, max: 20});
        req.checkBody('pwd1','Passwords do not match').equals(req.body.pwd);

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('signup', {errors : error.array()});
            }
            else {
                const d = new Date();
                let folder = "iitalumniapp/"+req.body.group+ "/" + req.body.username + "/" + d.getTime();

                cloudinaryClient.upload(profileimage, folder)
                .then((result) => {
                    let imageUrl;

                    if (profileimage) {
                        fs.unlink(profileimage);
                    }
                    if (!result) {
                        imageUrl = "";
                    } else {
                        imageUrl = result.url;
                    }

                    return User.create({
                    	firstname: req.body.FName,
                        lastname: req.body.LName,
                        username: req.body.username,
                        password: req.body.pwd,
                        email: req.body.email,
                        address: req.body.Address,
                        group: req.body.group,
                        profileimage: imageUrl
                    })
                })
                .then((user) => 
                {
                     res.redirect('/login');
                })
                .catch((error) =>
                {
                    res.render('signup', {errors : [{msg: error.message}]});
                });
            }
        });   
    }

};