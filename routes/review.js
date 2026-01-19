const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
} = require("../middleware.js");
const { createReview } = require("../controllers/reviews.js");

const router = express.Router({ mergeParams: true });

//post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// delete review route
router.delete(
  "/:ReviewId",
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(reviewController.destroyReview),
);
module.exports = router;
