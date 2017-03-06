const mongoose = require('mongoose');

// Photo Schema
const PhotoSchema = new mongoose.Schema({
    name: {
		type: String,
        unique: true,
        required: [true, 'Name is required.']
	},
	title: {
		type: String,
        required: [true, 'title is required.']
	},
	photoUrl:{
		type: String,
        required: [true, 'photo url is required.']
	},
    owner:{
		type: String,
        required: [true, 'owner is required.']
	},
    access: {
		type: String,
        default: "self",
        enum: ['self', 'shared']
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
    feature: {
		type: String,
        default: "gallery",
        enum: ['gallery', 'blog']
	}
});

const Photo =  mongoose.model('photo', PhotoSchema);

module.exports = Photo;