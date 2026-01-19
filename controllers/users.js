const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      email,
      username,
    });
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "user was registered successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcom to wonderlust u are logged in");
  let url = res.locals.savedUrl || "/listings";
  res.redirect(url);

  /*  if we write like this res.redirect("req.session.redirectUrl") 
    it will be undefined as our
    passport default session as we logged so thats why we use or with savedUrl
    and passed as middle ware it will be stored before logged in */
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged in! ");
    res.redirect("/listings");
  });
};
