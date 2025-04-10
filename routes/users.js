const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const validateUser = require("../config/middleware/validateUser");
const passport = require("passport");

router.get("/", usersControllers.getHome);

router
  .route("/register")
  .get(usersControllers.getRegisterForm)
  .post(validateUser, usersControllers.registerUser);

router
  .route("/login")
  .get(usersControllers.getLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersControllers.login
  );

router.get("/logout", usersControllers.logout);

module.exports = router;
