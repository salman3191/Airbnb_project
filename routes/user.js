const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// signup
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signUp));

// login
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

router.get("/logout", userController.logout);

module.exports = router;
