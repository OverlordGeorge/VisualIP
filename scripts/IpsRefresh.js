var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/local";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("local");
    console.log("connected to DB");
    dbo.collection("Ips").deleteMany();
    db.close();
    console.log("done");
});
