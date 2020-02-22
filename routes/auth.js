const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('../config/index');
var tokenStore = require('../storeStrategy');
var LOG = require('../utils/logger')(__filename)
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
        return tokenStore.newToken(resData);
    }).then(function (obj){ 
      res.json(obj);
    }).catch(function (err) {
        LOG.error(err)
        var errorMsg = {"msg":"Authentication failed, please check if username/passowrd is correct."}
        try{
          if(err.error)  errorMsg = JSON.parse(err.error);
        }catch(e){
          LOG.error(e);
        }
        res.status(err.statusCode || 400).json(errorMsg);
    });
});

router.get('/logout', function(req, res) {
  const token = req.headers[config.tokenName];
  if(token){
    tokenStore.removeToken(token)
    .then(function (){ 
        res.json({msg:'succes'});
    }).catch(function (err) {
        LOG.error(err);
        res.json({msg:'succes'});
    });
  }else{
    res.json({msg:'succes'});
  }
  
});

module.exports = router;
