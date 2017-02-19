const mongoose = require('mongoose');

// Contact Schema
const ContactSchema = mongoose.Schema({
    name: {
		type: String,
        required: [true, 'Name is required.']
	},
	email: {
		type: String,
        required: [true, 'email is required.']
	},
	message:{
		type: String,
        required: [true, 'message is required.']
	},
    createdate: {
        type: Date,
        default: Date.now
    }
});

const Contact =  mongoose.model('contact', ContactSchema);

module.exports = Contact;