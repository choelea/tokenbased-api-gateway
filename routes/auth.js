const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('../config/index');
var tokenStore = require('../storeStrategy');

/* GET users listing. */
router.post('/authenticate', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  request({
      method: 'POST',
      uri: config.authenticateUrl,
      body: { username,password },
      json: true
    }).then(function (resData) { 
        var token = tokenStore.create(resData);        
        console.log(`Got token:${token}`)
        res.json({useInfo:resData, token});
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
