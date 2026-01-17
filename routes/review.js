const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const { validateReview, isLoggedIn } = require("../middleware.js");

const router = express.Router({ mergeParams: true });

//post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
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
  }),
);

// delete review route
router.delete(
  "/:ReviewId",
  wrapAsync(async (req, res) => {
    let { id, ReviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: ReviewId } });
    await Review.findByIdAndDelete(ReviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  }),
);
module.exports = router;
