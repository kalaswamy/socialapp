const Photo = require('../models/photo');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {

    index(req, res, next) {
       let selfPhotos = {};
       let sharedPhotos = {};

       Photo.find({owner: req.user.username,
                   group: req.user.group,
                   access: "self"})
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
                                photos_shared: sharedPhotos 
                              });
       })
       .catch((error) => {

       });
    }
}