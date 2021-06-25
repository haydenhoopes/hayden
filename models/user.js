const mongoose = require("mongoose"),
passportLocalMongoose = require('passport-local-mongoose'),
mongooseUniqueValidator = require('mongoose-unique-validator'),
  userSchema = mongoose.Schema({
    name: {
        firstName: {
            required: true,
            type: String
        },
        lastName: {
            type: String,
            required: true
        },
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 10,
      },
  });

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", userSchema, "User");