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

// index route

app.get("/listings", async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// create new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await listing.findById(id);

    res.render("listings/show.ejs", { data });
  })
);
// new route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid response for listings");
    }
    const newlisting = new listing(req.body.listing);
    if (!newlisting.title) {
      throw new ExpressError(400, "Title missing");
    }

    if (!newlisting.description) {
      throw new ExpressError(400, " Description is missing");
    }

    if (!newlisting.price) {
      throw new ExpressError(400, "Price is missing");
    }

    if (!newlisting.location) {
      throw new ExpressError(400, "Location is missing");
    }
    if (!newlisting.country) {
      throw new ExpressError(400, "Country is missing");
    }

    await newlisting.save();
    res.redirect("/listings");
  })
);

// Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const data = await listing.findById(id);

    res.render("listings/edit.ejs", { data });
  })
);

// updata route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

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

//  Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
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
