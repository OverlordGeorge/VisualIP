var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var whois = require('./my_modules/Whois/WhoisFinder');
var reader = require('./my_modules/excelReader/Reader');
var fs = require('fs');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/*
Initializing section
 */

var port=config['server'].port;
var timeDelta = config['excel'].step;
var askDelta = config['options'].askDelay;

///


server.listen(port,function(){
    console.log("server is running on port: ",port);
});

app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname +'/node_modules'));

var ip = '89.105.140.135';
var refer = 'whois.iana.org';


var excel = new reader.ExcelReader('data/spamtest.xlsx');



io.sockets.on('connection',function(socket) {

    console.log('user connected');

    io.to(socket.id).emit('greetings',"welcome to server");

    var seconds = 5;
    var the_interval = 3000;
    setInterval(function() {
        var res = excel.getPerTime(seconds);
        if (res) {
            var objects =[];
            if (res.length != 0) {
                for (var i = 0; i < res.length; i++) {
                    var info = whois.FindIpBase(res[i].ip);
                    res[i].ll=[info.ll[0],info.ll[1]];
                    res[i].country = info.country;
                    res[i].city = info.city;
                    objects.push(res[i]);
                }
                io.to(socket.id).emit('getIpStack', objects);
            }
        }
    }, the_interval);

});


/*wh.FindIpWhoisRecursive(ip,refer,function(err,data){
    console.log(data);
    var addr = wh.Parser.FindField(data,"address:");
    console.log(addr);
})*/



