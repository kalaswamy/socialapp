const BlogPost = require('../models/blogpost');
const CommentSchema = require('../models/comment');
const fs = require('fs');
const cloudinaryClient = require("../library/cloudinarywrapper");
const util = require("../library/util");
const path = require("path");

module.exports = {
    index(req, res, next) {
       let allBlogs = {};
       let selfBlogs = {};

       BlogPost.find({group:req.user.group})
       .then((blog) => {
           allBlogs = blog;
           return BlogPost.find({group:req.user.group,
                                 name: req.user.username});
       })
       .then ((blog) => {
           selfBlogs = blog;
           res.render('blogpost', { blog_active: 'true',
                                    allblogs: allBlogs,
                                    selfblogs: selfBlogs
                                  });
       })
    },

    deleteBlog(req, res, next) {
        let id= req.params.id;
        let blog1 = {};

        BlogPost.findById(id)
        .then((blog) => {
            blog1 = blog;
            console.log(blog.photoUrl);
            let publicId;
            if (blog.photoUrl) {
                let extension = path.extname(blog.photoUrl);
                publicId = "iitalumniapp/"+req.user.group+ "/" + req.user.username + "/" + path.basename(blog.photoUrl, extension);
            }
            return cloudinaryClient.remove(publicId); //remove the photo first if any
        })
        .then((result) => {
            return blog1.remove(); //remove the blog ...
        })
        .then((blog) => {
            res.redirect('/blog');
        })

    },

    createComment(req, res, next) {
        console.log (req.body);

        req.checkBody('comment','comment field is required').notEmpty();
        req.checkBody('blogId','blog id is required').notEmpty();

        BlogPost.findById(req.body.blogId)
        .then((blog) => {
            let comment = {
                name: req.user.username,
                email: req.user.email,
                content: req.body.comment,
                profileimage: req.user.profileimage
            };
            blog.comments.push(comment);
            return blog.save();
        })
        .then((blog) =>{
            res.redirect('/blog');
        })
        .catch((error)=> {
            console.log(error);
        });
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

        req.checkBody('content','content field is required').notEmpty();
        req.checkBody('title','title field is required').notEmpty();
        
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                res.render('blogupload', {errors : error.array()});
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

                    return BlogPost.create({
                        name: req.user.username,
                        email: req.user.email,
                        title: req.body.title,
                        photoUrl: imageUrl,
                        content: req.body.content,
                        group: req.user.group
                    })
                })
                .then((blog) => 
                {
                    res.redirect('/blog');
                })
                .catch((error) =>
                {
                    res.render('blogpost', { blog_active: 'true', errors : [{msg: error.message}] });
                });
            }
        });   
    }
}