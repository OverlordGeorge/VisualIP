let IpScout = require('./IpScout');
let MongoHandler = require('./MongoHandler');

module.exports = class IpAnalyzer{

     constructor(db){
        this.scout = new IpScout();
        this.mongo = db;
     }

     eatIp(ip, time, isBad=true, type=null){
        let self = this;
        if (isBad === true){
            let basic = self.scout.getGeoIpInfo(ip);
            basic["ip"]=ip;
            basic["type"]=type;
            basic["times"] = time;
            this.insertToDB(basic);
            return basic;
        }
        return false;
     }

     sendToIps(info){
        let self = this;
        let myquery = {
            "properties.ip": info.ip
        };
        let newvalues = { $inc:
                {
                    "properties.count": 1
                },
            $push: {
                "properties.times": info["times"]
            }
        };
         self.mongo.collection("Ips").updateOne(myquery, newvalues, function(err, res) {
             if (err) throw err;
             if (res.modifiedCount===0)
                 self.createNewIp(info);
         });
      }

      createNewIp(info){
        let self = this;
        let obj ={
            properties: {
                ip: info.ip,
                count: 1,
                country: info.country,
                times: [
                    info["times"]
                ]
            },
            geometry: {
                type: "Point",
                coordinates: [info.ll[0],info.ll[1]]
            }
        }
        self.mongo.collection("Ips").insertOne(obj,function(err,res){
            if (err) throw err;
        })
      }

      createNewCountry(info){

      }

     sendToCountries(info){
         let self = this;
         let myquery = {
             "properties.alpha-2": info.country
         };
         let newvalues = { $inc:
                 {
                     "properties.amount": 1
                 }
         };
         self.mongo.collection("Countries").updateOne(myquery, newvalues, function(err, res) {
             if (err) throw err;
         });
     }

     insertToDB(info){
        this.sendToIps(info);
        this.sendToCountries(info);
     }

};
