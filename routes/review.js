const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");

const router = express.Router({ mergeParams: true });
// to validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};
//post review route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let lstng = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    lstng.reviews.push(newReview);
    await newReview.save();
    await lstng.save();
    // console.log("new review save");
    // res.send("new review save");
    res.redirect(`/listings/${lstng._id}`);
  })
);

// delete review route
router.delete(
  "/:ReviewId",
  wrapAsync(async (req, res) => {
    let { id, ReviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: ReviewId } });
    await Review.findByIdAndDelete(ReviewId);
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
