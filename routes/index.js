const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const data = {};
  
  if(req.user){
    data.aUserIsLoggedIn = true;
    data.user = req.user;
    data[req.user.role] = true;
  }

  res.render('index', data);
});

module.exports = router;
