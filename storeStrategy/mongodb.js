const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
const collectionName = 'apiproxytoken';
const config  = require('../config');
/**
 * { "_id" : ObjectId("5063114bd386d8fadbd6b004"), "timer":1,"userInfo":{}}
 */
class MongoStore {    
    constructor(config) {
        const newConnectionCallback = (err, client) => {
            if (err) {
              this.connectionFailed(err)
            } else {
              this.handleNewConnectionAsync(client, config.dbName,collectionName)
            }
        }
        MongoClient.connect(config.url, config.options, config,newConnectionCallback);
    }
    connectionFailed(err) {
        this.changeState('disconnected');
        throw err;
    }
    handleNewConnectionAsync(client, dbName, collectionName) {
        this.client = client
        this.db = typeof client.db !== 'function' ? client.db : client.db(dbName)
        this.collection = this.db.collection(collectionName);
        this.setAutoRemoveAsync()
          .then(() => this.changeState('connected'))
          .catch(err => {
              if(err.code!==85){
                  console.log(err)
              }
          })
    }
    changeState(newState) {
        if (newState !== this.state) {
            this.state = newState
            // this.emit(newState)
        }
    }
    setAutoRemoveAsync() {
        return this.collection.createIndex(
            { expires: 1 },{ expireAfterSeconds: config.tokenExpire }
        )
    }
    removeToken(token) {
        return this.collection.deleteOne({ _id:ObjectID(token) });
    }
    
    newToken(userInfo){
        var mongoCollection = this.collection;
        return new Promise(
            function (resolve, reject) {
                mongoCollection.insertOne({ expires: new Date(), userInfo },function(err,result){
                    if(!err){
                        resolve({token:result.insertedId,userInfo});
                    }else{
                        reject(err);
                    }
                });
            }
        )
    }
    create(userInfo) {        
        return this.collection.insertOne({ timer: new Date(), userInfo });
    }
    verify(token, callback) {
        this.collection.findOneAndUpdate({ _id:ObjectID(token) }, { $set: { expires: new Date() } }, {}, function (err, result) {
            if (!err && result.value) {
                // console.log(result);
                callback(err,result.value.userInfo);
            }else{
                callback(err);
            }
        })
    }
}

module.exports = MongoStore;