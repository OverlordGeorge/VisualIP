var express=require('express');
var app=express();
var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


var MongoHandler = require('./my_modules/MongoHandler');
var url = "mongodb://127.0.0.1:27017/";
var MongoClient = require('mongodb').MongoClient;
var IpAnalyzer = require('./my_modules/IpAnalyzer');
var Informer = require('./my_modules/Informer');


MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log("cant connect to Mongo")
        throw err;
    }
    var dbo = db.db("VisualIP");
    var ipanalyzer = new IpAnalyzer(dbo);
    var informer = new Informer(dbo);
    var currIps=[];
    var refreshInfo;
    var sendPercents = function(){};

    app.use(express.static(__dirname +'/public'));
    app.use(express.static(__dirname +'/node_modules'));

    app.post('/harvest', function (req, res) {
        if (req.body)
            if (req.body.data)
        {

            var data = JSON.parse(req.body.data);
            currIps=[];
            for (var i=0;i<data.length;i++) {
                var ip = data[i]['ip'];
                var time = data[i]['time'];
                console.log(ip);
                console.log(time);
                var info = ipanalyzer.eatIp(ip,time);
                currIps.push(info);
            }
            refreshInfo();
        }
        res.send('Ok');
    });

    server.listen(port,function(){
        console.log("server is running on port: ",port);
    });

    setInterval(function() {
        informer.countryPercents(function(data){
            sendPercents(data);
        })
        //sendPercents(1);
    }, 10000);

    io.sockets.on('connection',function(socket) {

        console.log('user connected, id: ', socket.id);
        io.to(socket.id).emit('sayHi', "welcome to server");

        socket.on('countryInfo',function(name){
            informer.countryInfo(name,function(data){
                if (data){
                    io.to(socket.id).emit('getCountryInfo', JSON.stringify(data));
                }
            })
        });

       /* setInterval(function() {
            informer.countryPercents(function(data){
                io.to(socket.id).emit('getCountryPercents', JSON.stringify(data));
            })
        }, 10000);*/

       sendPercents = function(data){
           io.to(socket.id).emit('getCountryPercents', JSON.stringify(data));
       };

        refreshInfo = function(){
            io.to(socket.id).emit('getIpStack', currIps);
        }
    });


});