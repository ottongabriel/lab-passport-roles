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


router.post('/users/delete/:id', (req,res,next) => {
  
  const userToDeleteId = req.params.id;

  User.findByIdAndRemove(userToDeleteId)
  .then(user =>{

    res.redirect('/all-users')

  })
  .catch((err) => { console.log('error:', err) });

})


router.get('/single/:theUserId', (req, res, next) => {
  // th ID of the user we are looking at
  const theId = req.params.theUserId

  User.findById(theId)
  .then(userToInspect => {
    let data = {};
    data.showingUser = userToInspect;

    if(req.user){
      data.aUserIsLoggedIn = true;
      data.loggedUser = req.user;
      
      data['loggedUserRoleIs' + req.user.role] = true;

      if(req.user._id == theId){
        data.loggedUserOwnsTheAccount = true;
      }

      if(userToInspect.role === "BOSS"){
        data.thisIsTheBossAccount = true;
      }
      
      
    }

    res.render('users/single', data)
  });
})

module.exports = router;
