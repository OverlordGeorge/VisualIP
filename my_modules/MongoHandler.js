/*
    @constructor
    @param MongoClient db
 */

module.exports = class MongoHandler{
    constructor(db){
        this.db = db;
    }

    insertOne(coll, obj){
        let self = this;
        self.db.collection(coll).insertOne(obj, function(err, res) {
            if (err) throw err;
        });
    };

    updateOne(coll,query,obj){
        let self = this;
        self.db.collection(coll).updateOne(query, obj,function (err,res) {
            if (err) throw err;
        })
    }

    insertMany(coll, arr){
        let self = this;
        self.db.collection(coll).insertMany(arr, function(err, res) {
            if (err) throw err;
        });
    };
};
