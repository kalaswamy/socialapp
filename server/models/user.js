const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
    required: [true, 'firstname is required.']
	},
  lastname: {
		type: String,
    required: [true, 'lastname is required.']
	},
  username : {
    type: String,
    required: [true, 'username is required.'],
    unique: true
  },
	password: {
		type: String,
    required: [true, 'password is required.'],
    minlength: 6
	},
	email: {
		type: String,
    unique: [true, 'email already exist.'],
    required: [true, 'email is required.']
	},
  role: {
		type: String,
    default: "user",
    enum: ['admin', 'user']
	},
  group: {
		type: String,
    default: "IIT",
    enum: ['IIT', 'Other']
	},
  address: {
		type: String
	},
	profileimage:{
		type: String,
    default:"img/user.png"
	},
  createdate: {
    type: Date,
    default: Date.now
  },
  updateddate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.statics.findById = function (id) {
  var User = this;

  return User.findOne({_id:id});
};

// Class method ...
UserSchema.statics.findByCredentials = function (username, password) {
  var User = this;

  return User.findOne({username}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  });
};

// Middleware to store the hashed password ...
UserSchema.pre('save', function(next) {
  var user = this;

  user.updateddate = Date.now;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// check for the duplicate keys ...
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('The username or email already exists.'));
  } else {
    next(error);
  }
});


const User =  mongoose.model('user', UserSchema);

module.exports = User;