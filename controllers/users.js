const User = require("../models/user");
const createError = require("http-errors");

const getHome = (req, res, next) => {
  res.redirect("/home");
};

const getRegisterForm = async (req, res, next) => {
  res.render("users/register");
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (error) => {
      if (error) {
        next(createError(500, error));
      }
    });

    req.flash("success", "You have succesfully registered");
    res.redirect("/campgrounds");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

const getLoginForm = (req, res, next) => {
  res.render("users/login");
};

const login = async (req, res, next) => {
  req.flash("success", "Hi bitch!");
  const redirectUrl = req.session.originalUrl || "/campgrounds";
  delete req.session.originalUrl;
  res.redirect(redirectUrl);
};

const logout = (req, res) => {
  req.logout();
  req.flash("success", "see ya bitch");
  res.redirect("/home");
};

module.exports = {
  getHome,
  getRegisterForm,
  registerUser,
  getLoginForm,
  login,
  logout,
};
