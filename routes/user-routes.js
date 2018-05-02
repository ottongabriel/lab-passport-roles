const express = require('express');
const router  = express.Router();
const passport    = require("passport");
const User        = require("../models/user");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");


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



router.get('/all-users', (req, res, next) => {
  User.find({})
  .then((users) => {
    let data = {};
    data.allUsers = users;

    res.render('users/all-users', data);
  })
});


router.get('/single/:theUserId', (req, res, next) => {
  const theId = req.params.theUserId

  User.findById(theId)
  .then(userToInspect => {
    let data = {};
    data.showingUser = userToInspect;

    if(req.user){
      data.aUserIsLoggedIn = true;
      data.loggedUser = req.user;
      data['loggedUserIs' + req.user.role] = true;
      // if ()
    }

    res.render('users/single', data)
  });
})

module.exports = router;
