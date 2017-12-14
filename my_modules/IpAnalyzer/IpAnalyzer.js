var whois = require('../Whois/WhoisFinder');

function IpAnalyzer(timeDelta){
    this.countries = [];
    this.countryPercents =[];
    this.timeDelta = timeDelta;
    this.ips = [];
}

IpAnalyzer.prototype.eatIp=function(ip,country,ll){
    for (var i=0;i<this.ips.length;i++){
        if (this.ips[i] == ip){
            
        }
    }
}