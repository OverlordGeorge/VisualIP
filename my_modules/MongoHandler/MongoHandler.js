/*
    @constructor
    @param MongoClient db
 */

class MongoHandler{
    constructor(db){
        this.db = db;
    }

    insertOne(coll, obj){
        let self = this;
        self.db.collection(coll).insertOne(obj, function(err, res) {
            if (err) throw err;
        });
    };

    getCountryInfo = (countryCode, callback) => {
        let self = this;
        let countryQuery = {
            'dest.country': countryCode
        };
        self.db.collection('Ips').find(countryQuery, {}).toArray( (err, data)=> {
            if (err){
                callback({
                    'total': 0,
                    'bots': 0,
                    'infected': 0
                });
            } else{
                let result = {
                    'total': data.length,
                    'bots': data.filter((obj) => obj.source.http_user_agent).length,
                    'infected': data.filter((obj) => !isNaN(obj.source.networkAns) && obj.source.networkAns).length
                }
                callback(result);
            }
        })
    }

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

module.exports.MongoHandler = MongoHandler;

