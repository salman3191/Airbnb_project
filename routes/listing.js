const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const upload = multer({ dest: "/uploads" });

// index route and new route

router
  .route("/")
  .get(validateListing, wrapAsync(listingController.index))
  // .post(validateListing, wrapAsync(listingController.createListing));
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });

// create new route
router.get(
  "/new",
  isLoggedIn,
  validateListing,
  listingController.renderNewForm,
);

// show route,update route and delete route
router
  .route("/:id")
  .get(validateListing, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
