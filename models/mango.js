const mongoose = require("mongoose"),
  mangoSchema = mongoose.Schema({
      date: {
          type: Date,
          required: true
      },
      source: {
          type: String,
          required: true
      },
      type: {
          type: String,
          required: true
      },
      category: {
          type: String,
          required: true
      },
      paymentMethod: {
          type: String,
          required: true
      },
      description: {
          type: String
      },
      isNormal: {
          type: Boolean,
          default: true
      },
      amount: {
          type: Number,
          required: true
      },
      who: {
          type: String
      },
      tithing: {
          type: Boolean,
          default: false
      }
  });


module.exports = mongoose.model("Mango", mangoSchema, "Mango");
