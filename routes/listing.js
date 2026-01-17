const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index route

router.get("/", validateListing, async (req, res) => {
  const allListings = await listing.find({});

  res.render("listings/index.ejs", { allListings });
});

// create new route
router.get("/new", isLoggedIn, validateListing, (req, res) => {
  res.render("listings/new.ejs");
});

// show route
router.get(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!data) {
      req.flash("error", "listing not found!");
      return res.redirect("/listings");
    }
    console.log(data);
    res.render("listings/show.ejs", { data });
  }),
);
// new route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);
    console.log(req.user);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  }),
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const data = await listing.findById(id);

    res.render("listings/edit.ejs", { data });
  }),
);

// updata route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated!");

    res.redirect(`/listings/${id}`);
  }),
);

//  Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req);

    req.flash("success", "listing deleted successfully");
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
