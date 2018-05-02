const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");

const flash       = require("connect-flash");

const ensureLogin = require("connect-ensure-login");



// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}



authRoutes.get("/create-user", checkRoles('BOSS'), (req, res, next) => {
  res.render("auth/create-user");
});

authRoutes.post("/create-user", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/create-user", { message: "Please indicate username and password" });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/create-user", { message: "Sorry, that username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username:username,
      password: hashPass,
      role: role
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/create-user", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});



authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local",
{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}
));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



authRoutes.get('/private', checkRoles('BOSS'), (req, res) => {
  res.render('auth/private', {user: req.user});
});



module.exports = authRoutes;