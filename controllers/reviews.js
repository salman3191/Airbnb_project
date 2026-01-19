const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let lstng = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  lstng.reviews.push(newReview);
  await newReview.save();
  await lstng.save();
  req.flash("success", "New Review Created!");
  // console.log("new review save");
  // res.send("new review save");
  res.redirect(`/listings/${lstng._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, ReviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: ReviewId } });
  await Review.findByIdAndDelete(ReviewId);
  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
