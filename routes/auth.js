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
  const email = req.body.email;
  const password = req.body.password;
  request(`${config.resourceServer}/group-buying/users/login?userEmail=${email}&password=${password}`)
    .then(function (resData) {
        const tokenUser = JSON.parse(resData)        
        tokenUser.chemToken = jwt.sign(tokenUser.data, config.tokenSecret, {
                    // expiresIn: 86400 // expires in 24 hours
                    expiresIn: 60 // expires in 24 hours
        });
        res.json(tokenUser)
    })
    .catch(function (err) {
        console.log(err)
        res.json(err)
    });
});

module.exports = router;
