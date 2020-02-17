const jwt    = require('jsonwebtoken');
const config = require('../config/index');

class JWTStore {
    newToken(userInfo){
        return new Promise(
            function (resolve) {
                var token = jwt.sign(userInfo, config.tokenSecret, {
                    expiresIn: config.tokenExpire
                });
                resolve({token,userInfo});
            }
        )
    }
    create(userInfo){
        return jwt.sign(userInfo, config.tokenSecret, {
            expiresIn: config.tokenExpire
        });
    }
    verify(token, callback){
        jwt.verify(token, config.tokenSecret, function (err, userData) {
            callback(err, userData);
        });       
    }
}

module.exports = JWTStore;