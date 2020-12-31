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
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // password: {
    //     type: String,
    //     required: true,
    //     min: 5,
    //   },
  });

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", userSchema, "User");
