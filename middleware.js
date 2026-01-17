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
