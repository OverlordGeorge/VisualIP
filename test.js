
var express=require('express');
var app=express();
var bodyParser=require("body-parser");

var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var fs = require('fs');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/*
Initializing section
 */

var port=8083;
var timeDelta = config['excel'].step;
var askDelta = config['options'].askDelay;

///


var MongoHandler = require('./my_modules/MongoHandler');
var url = "mongodb://127.0.0.1:27017/";
var MongoClient = require('mongodb').MongoClient;
var IpAnalyzer = require('./my_modules/IpAnalyzer');
var Informer = require('./my_modules/Informer');


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("local");
    var ipanalyzer = new IpAnalyzer(dbo);
    var informer = new Informer(dbo);
    setInterval(function() {
        informer.countryPercents(function(data){
            console.log(1);
            console.log(data);
        })
    }, 10000);
});

/*setInterval(function() {
    console.log(1);
}, 1000);*/