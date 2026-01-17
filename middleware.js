const listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // print this to see what req object contains
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must logged in ");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.savedUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner._id.equals(res.locals.CurrUser._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// to validation listing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};

// to validate review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};
