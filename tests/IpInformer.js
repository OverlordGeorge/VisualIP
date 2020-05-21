let MongoClient = require('mongodb').MongoClient;
let config = require('../config.json');
let IpInformer = require('../my_modules/IpInformer/IpInformer').IpInformer;

MongoClient.connect(config.mongo.url, function (err, connection) {

    let db = connection.db("VisualIp");
    let coll = db.collection("Ips");
    let ipInformer = new IpInformer(coll);

    console.log('starts');
    ipInformer.getFullIpInfo("89.105.140.135", (data)=>{
      console.log(data);
    })

})
