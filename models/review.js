const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    Default: Date.now(),
  },
});

module.exports = mongoose.Model("Review", reviewSchema);
