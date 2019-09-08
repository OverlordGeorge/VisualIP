let whois=require('node-whois');
let geoip = require('geoip-lite');
let WhoisParser = require('./WhoisParser');

module.exports = class IpScout{
    constructor(){
        this.whParser = new WhoisParser();
    }

    getGeoIpInfo(ip){
        let res = geoip.lookup(ip);
        if (res) return res;
        else return false;
    }

    findIpByWhois(ip,refer,callback){
        var opt = {
            server: refer,
            response: 2,
            timeout: 10000
        }
        whois.lookup(ip,opt,callback);
    };

    getWhoisInfo(ip, refer,callback){
        let self = this;
        this.findIpByWhois(ip,refer,function (err,data) {
            let newrefer = self.whParser.findSpecificField('refer',data);
            if (newrefer){
                self.getWhoisInfo(ip,newrefer,callback);
            }
            else{
                let res = self.whParser.getSortedList(data);
                callback(res);
            }
        })
    }
};