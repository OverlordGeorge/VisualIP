let IpScout = require('./IpScout');
let MongoHandler = require('./MongoHandler/MongoHandler');

module.exports = class Informer{

    constructor(db){
        this.scout = new IpScout();
        this.mongo = db;
    }

    ipWhois(ip,callback){
        let self = this;
        self.scout.getWhoisInfo(ip,"whois.iana.org",callback);
    }

    ipInfo(ip,callback){
        let self=this;
        let query={
            "properties.ip":ip
        };
        self.mongo.collection("Ips").findOne(query,function(err,res){
            callback(res);
        })
    }

    countryPercents(callback){
        let self = this;
        let query ={
        };
        self.mongo.collection("Countries").find(query).toArray(function(err,res){
            let total = 0;
            for (let i=0;i<res.length;i++){
                let props = res[i].properties;
                delete res[i].geometry;
                if (props.amount)
                {
                    total+=props.amount;
                }
                else{
                    res[i].properties['amount'] = 0;
                }
            }
            for (let i=0;i<res.length;i++){
                res[i].properties.percent =(res[i].properties.amount)/(total);
            }
            callback(res);
        });
    }

    countryInfo(name,callback){
        let self = this;
        let query = {
          "properties.alpha-3": name
        };
        if (name){
            self.mongo.collection("Countries").findOne(query,function(err,res){
                let country = res;
                let code = res.properties['alpha-2'];
                let newQuery = {
                    "properties.country": code
                };
                self.mongo.collection("Ips").find(newQuery).toArray(function(err,res){
                    let result ={
                        "country": country.properties,
                        "ips": res
                    };
                    callback(result);
                })
            })
        }
        else return false;
    }

    findCoutryIps(country){

    }

};