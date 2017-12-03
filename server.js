var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var whois = require('./my_modules/Whois/WhoisFinder');
var reader = require('./my_modules/excelReader/Reader');

/*
 optional parametrs
 */

var port=3000;
var timeDelta = 1000;

server.listen(port,function(){
    console.log("server is running on port: ",port);
});

app.use(express.static(__dirname +'/public'));
//app.use(express.static(__dirname +'/bower_components'));

var ip = '89.105.140.135';
var refer = 'whois.iana.org';

var excel = new reader.ExcelReader('data/spamtest.xlsx');

var seconds = 5, the_interval = 2 * 1000;
setInterval(function() {
    var res = excel.getPerTime(seconds);
    if (res)
        if (res.length!=0)
            for (var i=0;i<res.length;i++){
                console.log(res[i].ip);
                var info = whois.FindIpBase(res[i].ip);
                console.log(info);
            }
}, the_interval);


/*wh.FindIpWhoisRecursive(ip,refer,function(err,data){
    console.log(data);
    var addr = wh.Parser.FindField(data,"address:");
    console.log(addr);
})*/



