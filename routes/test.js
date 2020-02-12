var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  var msg = "This is a test";
  res.json({msg, user:req.user});
});

module.exports = router;
