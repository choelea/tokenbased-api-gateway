const config = require('../config/index');

var store;
if(config.tokenStrategy=='jwt'){
    const JWTStore = require('./jwt');
    store = new JWTStore();
}else if (config.tokenStrategy=='mongodb'){
    const MongoStore  = require('./mongodb');
    store =  new MongoStore(config.mongo);
}
module.exports = store;
