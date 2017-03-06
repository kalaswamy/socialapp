const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    name: {
		type: String,
        required: [true, 'Name is required.']
	},
	email: {
		type: String,
        unique: true,
        required: [true, 'email is required.']
	},
    profileimage:{
		type: String
	},
    content:{
		type: String,
        required: [true, 'content is required.']
	},
    createdate: {
        type: Date,
        default: Date.now
    }
});

module.exports = CommentSchema;