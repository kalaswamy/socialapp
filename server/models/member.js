const mongoose = require('mongoose');

// Member Schema
const MemberSchema = mongoose.Schema({
	firstname: {
		type: String,
        required: [true, 'firstname is required.'],
		index: true
	},
    lastname: {
		type: String,
        required: [true, 'lastname is required.']
	},
	password: {
		type: String,
        required: [true, 'password is required.']
	},
	email: {
		type: String,
        required: [true, 'email is required.']
	},
    role: {
		type: String,
        default: "user"
	},
    group: {
		type: String,
        default: "IIT"
	},

	profileimage:{
		type: String
	}
});

const Member =  mongoose.model('member', MemberSchema);

module.exports = Member;