const User = require('../models/user');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       console.log(req.user);
       let iitselected;
       if (req.user.group === "IIT"){
           iitselected = true;
       }
       res.render('profile', { 
           profile_active: 'true',
           firstname: req.user.firstname,
           lastname: req.user.lastname,
           username: req.user.username,
           email: req.user.email,
           address: req.user.address,
           profileimage: req.user.profileimage,
           role: req.user.role,
           group: req.user.group,
           iitselected: iitselected
       });
    },

    update(req, res, next) {
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

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('profile', {errors : error.array()});
            }
            else {
                const d = new Date();
                let folder = "iitalumniapp/"+req.body.group+ "/" + req.body.username + "/" + d.getTime();
                let reslt;

                cloudinaryClient.upload(profileimage, folder)
                .then((result) => {
                    reslt = result;
                    return User.findOne({username:req.user.username});
                })
                .then((doc) => {
                     doc.firstname = req.body.FName;
                     doc.lastname = req.body.LName;
                     doc.address = req.body.Address;
                     doc.updateddate = Date.now();
                     doc.group = req.body.group;
                     if (reslt) {
                         doc.profileimage = reslt.url;
                     }
                     return doc.save()
                })
                .then((user) => 
                {
                     res.redirect('/index');
                })
                .catch((error) =>
                {
                    res.render('profile', {errors : [{msg: error.message}]});
                });
            }
        });   
     }
}