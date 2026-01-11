const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");

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
sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));

// for listing routes
app.use("/listings", listings);

// for review routes
app.use("/listings/:id/reviews", reviews);

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
