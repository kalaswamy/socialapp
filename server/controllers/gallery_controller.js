const Photo = require('../models/photo');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       let selfPhotos = {};
       let sharedPhotos = {};
       let allPhotos = {};

       Photo.find({group: req.user.group,
                   access: "shared"})
       .then ((docs) => {
            allPhotos = docs;
            return Photo.find({owner: req.user.username,
                   group: req.user.group,
                   access: "self"});
       })
       .then ((docs) => {
           console.log(docs);
           selfPhotos = docs;
           return Photo.find({owner: req.user.username,
                   group: req.user.group,
                   access: "shared"});
       })
       .then ((docs) => {
           console.log(docs);
           sharedPhotos = docs;

           res.render('gallery', 
                              { gallery_active: 'true',
                                photos_self: selfPhotos,
                                photos_shared: sharedPhotos,
                                photos_all: allPhotos
                              });
       })
       .catch((error) => {

       });
    },

    deletePhoto(req, res, next){
        let id= req.params.id;
        let photo1 = {};

         Photo.findById(id)
        .then((photo) => {
            photo1 = photo;
            console.log(photo.photoUrl);
            let publicId;
            if (photo.photoUrl) {
                let extension = path.extname(photo.photoUrl);
                publicId = "iitalumniapp/"+req.user.group+ "/" + req.user.username + "/" + path.basename(photo.photoUrl, extension);
            }
            return cloudinaryClient.remove(publicId); //remove the photo first if any
        })
        .then((result) => {
            return photo1.remove(); //remove the photo ...
        })
        .then((photo1) => {
            res.redirect('/gallery');
        })
    }
}