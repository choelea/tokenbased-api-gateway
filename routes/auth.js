const express = require('express');
const router = express.Router();
const request = require('request-promise');
const jwt    = require('jsonwebtoken');

const AUTHENTICAION_URL = 'http://192.168.1.97:8103/group-buying/users/login';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/authenticate', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  request(`${AUTHENTICAION_URL}?userEmail=${email}&password=${password}`)
    .then(function (resData) {
        const tokenUser = JSON.parse(resData)        
        tokenUser.chemToken = jwt.sign(tokenUser.data, 'secret-which-should-be-configured-in-another-file', {
					expiresIn: 86400 // expires in 24 hours
        });
        res.json(tokenUser)
    })
    .catch(function (err) {
        console.log(err)
        res.json(err)
    });
});

module.exports = router;
