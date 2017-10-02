var whois=require('node-whois');
var strparser = require('../../my_modules/StingParser/Parsers');

/*
Find ip's info through geoip through db delivered MaxMind
 */
var FindIpBase = function(ip){
    return geoip.lookup(ip);
}

/*

 */

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