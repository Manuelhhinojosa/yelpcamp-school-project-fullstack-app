const isUserAunthenticated = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;
    req.flash("error", "You must be signed in to go to this page");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = isUserAunthenticated;
