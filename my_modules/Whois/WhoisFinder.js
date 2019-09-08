var whois=require('node-whois');
var strparser = require('../../my_modules/StingParser/Parsers');
var geoip = require('geoip-lite');
var parser = require('parse-whois');

class IpScout{
    constructor(){

    }

    getGeoIpInfo(ip){
        let res = geoip.lookup(ip);
        if (res) return res;
        else return false;
    }

    getWhoisInfo(ip){

    }


}

IpScout.prototype.findInGeoIp =function(ip) {
    let res = geoip.lookup(ip);
    return res;
};

IpScout.prototype.findByWhois =function(ip,refer){
    var opt = {
        server: refer,
        response: 2,
        timeout: 10000
    }
    whois.lookup(ip,opt,function (data) {
        console.log(parser.parseWhoIsData(data));
    });
}

var ip = '213.154.64.0';
let refer = 'whois.ripe.org';
let scout = new IpScout();
whois.lookup(ip, function(err, data){
    if (err) throw err;

    console.log(data);

    console.log(parser.parseWhoIsData(data));
});
/*
Find ip's info through geoip through db delivered MaxMind
 */
var FindIpBase = function(ip){
    return geoip.lookup(ip);
}

/*
function that looking for necessary info in GeoIp DB
 */

var findInGeoIp=function(ip){
    var res = geoip.lookup(ip);
    return res;
}

/*
function that find info about IP through whois
 */
var FindIpWhois=function(ip,refer,callback){
    var opt = {
        server: refer,
        response: 2,
        timeout: 10000
    }
    whois.lookup(ip,opt,callback);
};

/*
Recursive search ip's info trough referal links given by referal's whois
 */
var FindIpWhoisRecursive = function(ip,refer,callback){
    FindIpWhois(ip,refer,function (err,data) {
        var newrefer = strparser.FindField(data,'refer:');
        if (newrefer!='') {
            FindIpWhoisRecursive(ip,newrefer,callback);
        }
        else callback(null,data);
    })
};

module.exports.FindIpWhois = FindIpWhois;
module.exports.FindIpBase = FindIpBase;
module.exports.FindIpWhoisRecursive = FindIpWhoisRecursive;
module.exports.Parser = strparser;
module.exports.findInGeoIp = findInGeoIp;