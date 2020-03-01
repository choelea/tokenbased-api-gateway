const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('../config/index');
var tokenStore = require('../storeStrategy');
// eslint-disable-next-line no-undef
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
        LOG.error(`------Login Failed------URL:${config.authenticateUrl}    ${username}/${password}`)
        LOG.error(err)
        // var errorMsg = {"msg":"登录失败，用户名或者密码错误."}
        try{
          res.status(err.statusCode || 400).json(err.error);
        }catch(e){
          LOG.error(e);
          throw e;
        }
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
