const mongoose = require('mongoose');
const CommentSchema = require('./comment');

// Post Schema
const BlogPostSchema = new mongoose.Schema({
    name: {
		type: String,
        required: [true, 'name is required.']
	},
	email: {
		type: String,
        unique: true,
        required: [true, 'email is required.']
	},
    title:{
		type: String,
        required: [true, 'title is required.']
	},
    photoUrl:{
		type: String
	},
	content:{
		type: String,
        required: [true, 'content is required.']
	},
    group: {
		type: String,
        default: "IIT",
        enum: ['IIT', 'Other']
	},
    createdate: {
        type: Date,
        default: Date.now
    },
    comments: [CommentSchema]  // embedding the document - sub document
});

BlogPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

const BlogPost =  mongoose.model('blogpost', BlogPostSchema);

module.exports = BlogPost;