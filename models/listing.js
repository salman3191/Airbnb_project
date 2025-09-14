const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingScehma = new Schema({
  title: {
    type: String,

    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v /*to set value for image if image link given by user is empty*/,
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const listing = mongoose.model("listing", listingScehma);

module.exports = listing;
