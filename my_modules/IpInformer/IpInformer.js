let IpScout = require('../IpScout').IpScout;

class IpInformer {

    constructor(db) {
        this.scout = new IpScout();
        this.mongo = db;
    }

    getFullIpInfo(ip, callback){
        let result = {};
        let coordinates = this.ipGeoInfo(ip);
        if (coordinates){
            result['geoInfo'] = coordinates;
        }
        this.ipWhoisInfo(ip, (whoisAns) => {
            if (whoisAns){
                result['whois'] = this.convertWhoisAns(whoisAns);
            }
            this.getDbConclusion(ip, (dbData) =>{
                if (dbData){
                    result['dbAns'] = dbData;
                }
                callback(result);
            })
        })

    }

    convertWhoisAns(whoisAns){
        return Object.assign({}, whoisAns);
    }

    ipWhoisInfo(ip, callback) {
        let self = this;
        self.scout.getWhoisInfo(ip, "whois.iana.org", callback);
    }

    ipGeoInfo(ip){
        return this.scout.getGeoIpInfo(ip);
    }

    getDbConclusion(ip, callback){
        this.mongo.find({"source.ip":ip}).toArray((err, result) => {
            if (err || result.length === 0){
                callback(false);
            } else{
                callback(result[0].source);
            }
        })
    }

}

module.exports.IpInformer = IpInformer;