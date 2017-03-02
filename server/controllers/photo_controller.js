const Photo = require('../models/photo');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       res.render('photoupload', { photoupload_active: 'true' });
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

        req.checkBody('Name','Name field is required').notEmpty();
        req.checkBody('Title','Title field is required').notEmpty();
        
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('photoupload', {errors : error.array()});
            }
            else {
                const d = new Date();
                let folder = "iitalumniapp/"+req.user.group+ "/" + req.user.username + "/" + d.getTime();

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

                    return Photo.create({
                        name: req.body.Name,
                        title: req.body.Title,
                        photoUrl: imageUrl,
                        owner: req.user.username,
                        group: req.user.group,
                        access: req.body.Access
                    })
                })
                .then((user) => 
                {
                     res.redirect('/gallery');
                })
                .catch((error) =>
                {
                    res.render('photoupload', {errors : [{msg: error.message}]});
                });
            }
        });   
    }

};