const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";
const listing = require("./models/listing.js");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
