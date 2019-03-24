var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var fs = require('fs');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/*
Initializing section
 */

var port=8081;
var timeDelta = config['excel'].step;
var askDelta = config['options'].askDelay;

///

app.get('/', function(req, res) {
    res.send('hello world');
});

app.post('/', function(req, res) {
    res.send('hello world');
});


server.listen(port,function(){
    console.log("server is running on port: ",port);
});

//app.use(express.static(__dirname +'/public'));
//app.use(express.static(__dirname +'/node_modules'));

var ip = '89.105.140.135';
var refer = 'whois.iana.org';
var time =0;


/*setInterval(function() {
    var res = excel.getPerTime(seconds);
    if (res) {
        var objects =[];
        if (res.length != 0) {
            for (var i = 0; i < res.length; i++) {
                var info = whois.FindIpBase(res[i].ip);
                res[i].ll=[info.ll[0],info.ll[1]];
                res[i].country = info.country;
                res[i].city = info.city;
                analyzier.eatIp(res[i],time);
                objects.push(res[i]);
            }
            time+=seconds;
           // io.to(socket.id).emit('getIpStack', objects);
        }
    }
}, the_interval);*/


io.sockets.on('connection',function(socket) {

    console.log('user connected, id: ',socket.id);

    socket.on('greetings',function(){
        io.to(socket.id).emit('test',"welcome to server");
    });

   /* socket.on('countryInfo',function(data){
        console.log(data);
        console.log(analyzier.getCountryInfo(data));
        io.to(socket.id).emit('getCountryInfo', analyzier.getCountryInfo(data));
    });


    setInterval(function() {
            var objects = analyzier.getLast();
            io.to(socket.id).emit('getIpStack', objects);
    }, the_interval);*/

});





