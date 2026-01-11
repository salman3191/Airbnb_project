const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const router = express.Router();

// to validation listing
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

// index route

router.get("/", validateListing, async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// create new route
router.get("/new", validateListing, (req, res) => {
  res.render("listings/new.ejs");
});

// show route
router.get(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", { data });
  })
);
// new route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);

    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

// Edit route
router.get(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const data = await listing.findById(id);

    res.render("listings/edit.ejs", { data });
  })
);

// updata route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated!");

    res.redirect("/listings");
  })
);

//  Delete route
router.delete(
  "/:id",

  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req);

    req.flash("success", "listing deleted successfully");
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
