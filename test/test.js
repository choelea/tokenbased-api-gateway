class Test{
    create(info){
        this.insert(info, function(err, doc){
            if(!err){
                console.log(`Get ID: ${doc.id}`)
                return doc.id;
            }

        })
        
    }
    insert(info, callback){
        console.log(`get info :${info}`);
        var id = 0;
        for (let index = 0; index < 1000000; index++) {
            id ++;
        }
        callback(null, {id});
    }
}

const test = new Test();
console.log(test.create('suiyi')); // 我想要这里直接放回结果。