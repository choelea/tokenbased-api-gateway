const express = require('express');
const router = express.Router();
const request = require('request-promise');
const jwt    = require('jsonwebtoken');
const config = require('../config/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/authenticate', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  request({
      method: 'POST',
      uri: config.userInfoUrl,
      body: { username,password },
      json: true
    }).then(function (resData) { 
        var jwtToken = jwt.sign(resData, config.tokenSecret, {
                    expiresIn: 86400 // expires in 24 hours
        });
        res.json({useInfo:resData, token:jwtToken});
    }).catch(function (err) {
        var errorMsg = {"msg":"Authentication failed, please check if username/passowrd is correct."}
        try{
          if(err.error)  errorMsg = JSON.parse(err.error);
        }catch(e){
          console.log(e);
        }
        res.status(err.statusCode || 400).json(errorMsg);
    });
});

module.exports = router;
