const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
const port = 8080;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/listings", listings);

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

// app.get("/listingtest", async (req, res) => {
//   let sampledlisting = new listing({
//     title: "My New Villa",
//     description: "By The Beach",
//     price: 1200,
//     location: "srinager",
//     country: "india",
//   });
//   await sampledlisting.save();
//   console.log("sample was saved");
//   res.send("sucessful testing");
// });

// post review route
app.post(
  "/listings/:id/reviews",
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
app.delete(
  "/listings/:id/reviews/:ReviewId",
  wrapAsync(async (req, res) => {
    let { id, ReviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: ReviewId } });
    await Review.findByIdAndDelete(ReviewId);
    res.redirect(`/listings/${id}`);
  })
);
// if non of route match
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs", { message });
});
app.listen(port, (req, res) => {
  console.log("listening to port 8080");
});
