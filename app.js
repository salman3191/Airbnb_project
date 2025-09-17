const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";
const listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const data = await listing.findById(id);

  res.render("listings/show.ejs", { data });
});
// new route
app.post("/listings", async (req, res) => {
  const newlisting = new listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});

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

app.listen(port, (req, res) => {
  console.log("listening to port 8080");
});
