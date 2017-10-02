var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var port=3000;
var wh = require('./my_modules/Whois/WhoisFinder');

server.listen(port,function(){
    console.log("server is running on port: ",port);
});

app.use(express.static(__dirname +'/public'));
//app.use(express.static(__dirname +'/bower_components'));

var ip = '89.105.140.135';
var refer = 'whois.iana.org';

wh.FindIpWhoisRecursive(ip,refer,function(err,data){
    console.log(data);
    var addr = wh.Parser.FindField(data,"address:");
    console.log(addr);
})



