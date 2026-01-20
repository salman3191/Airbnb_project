const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await listing.find({});

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
  // console.log(data);
  res.render("listings/show.ejs", { data });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "  ", filename);
  const newlisting = new listing(req.body.listing);
  // console.log(req.user);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const data = await listing.findById(id);

  res.render("listings/edit.ejs", { data });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "listing updated!");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  // console.log(req);

  req.flash("success", "listing deleted successfully");
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
