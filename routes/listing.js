const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
// index route
router.get("/", validateListing, wrapAsync(listingController.index));

// create new route
router.get(
  "/new",
  isLoggedIn,
  validateListing,
  listingController.renderNewForm,
);

// show route
router.get("/:id", validateListing, wrapAsync(listingController.showListing));

// new route
router.post("/", validateListing, wrapAsync(listingController.createListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditForm),
);

// updata route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);

//  Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
