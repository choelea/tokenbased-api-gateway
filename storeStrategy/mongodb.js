const MongoClient = require('mongodb').MongoClient;
const collectionName = 'apiproxytoken';
/**
 * { "_id" : ObjectId("5063114bd386d8fadbd6b004"), "timer":1,"userInfo":{}}
 */
class MongoStore {    
    constructor(options) {
        const newConnectionCallback = (err, client) => {
            if (err) {
              this.connectionFailed(err)
            } else {
              this.handleNewConnectionAsync(client, options.dbName,collectionName)
            }
        }
        MongoClient.connect(options.url,  newConnectionCallback);
    }
    connectionFailed(err) {
        this.changeState('disconnected')
        throw err
    }
    handleNewConnectionAsync(client, dbName, collectionName) {
        this.client = client
        this.db = typeof client.db !== 'function' ? client.db : client.db(dbName)
        this.collection = this.db.collection(collectionName);
        return this.setAutoRemoveAsync()
          .then(() => this.changeState('connected'))
    }
    changeState(newState) {
        if (newState !== this.state) {
            this.state = newState
            // this.emit(newState)
        }
    }
    setAutoRemoveAsync() {
        return this.collection.createIndex(
            { expires: 1 },{ expireAfterSeconds: 60 }
        )
    }
    
    
    create(userInfo) {        
        this.collection.insertOne({ timer: new Date(), userInfo },function(err,result){
            if(!err){
                return result.insertedId;
            }else{
                throw err;
            }
        });
    }
    verify(token, callback) {
        this.collection.findOneAndUpdate({ _id: token }, { $set: { expires: new Date() } }, {}, function (err, result) {
            if (!err) {
                console.log(result)
                callback(err,result);
            }else{
                callback(err);
            }
        })
    }
}

module.exports = MongoStore;