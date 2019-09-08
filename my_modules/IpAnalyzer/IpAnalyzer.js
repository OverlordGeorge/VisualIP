var whois = require('../Whois/WhoisFinder');

function IpAnalyzer(){
    this.countries = [];
    this.amount = 0;
    this.countryPercents =[];
    this.ips = [];
    this.times = {};
    this.lastTime=0;
}

IpAnalyzer.prototype.eatIp=function(ip,times){
    var time = times.toString();
    var country = ip.country;
            if (country in this.countries) {
                this.countries[country].amount++;
                this.countries[country].ips.push(ip.ip);
            }
            else this.countries[country] = {
                amount: 1,
                ips: [ip.ip]
            };
            if (time in this.times)
                this.times[time].push(ip);
            else {
                this.times[time]=[];
                this.times[time].push(ip);
            }
            this.amount++;
            this.lastTime=time;
}

IpAnalyzer.prototype.getLast=function(){
    return this.times[this.lastTime];
}

IpAnalyzer.prototype.analyzePercents=function() {
    var names = Object.keys(this.countries);
        for (var i =0 ;i< names.length;i++){
           this.countryPercents[names[i]] = this.countries[names[i]]/this.amount;
        }
}

IpAnalyzer.prototype.getCountryInfo=function(country){
       if (this.countries[country]){
           return this.countries[country];
       }
       else return 0;
}

IpAnalyzer.prototype.analyze=function(){
    this.analyzePercents();
    return this;
}

IpAnalyzer.prototype.getTimeInfo=function(a,b){
    var res = [];
    for (var i =0;i<this.times.length;i++)
    {
        if (this.times[i]>b) break;
        if (this.times[i]>a)
            for (var j=0; j<this.times[i].length;j++)
                res.push(this.times[i][j]);
    }
    return res;
}

module.exports.IpAnalyzer = IpAnalyzer;