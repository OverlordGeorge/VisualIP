var request = require("request");
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var reader = require('./my_modules/excelReader/Reader');
var port = 3010;

server.listen(port,function(){
    console.log("server is running on port: ",port);
});

var excel = new reader.ExcelReader('data/spam.csv');

var seconds = 25;
var the_interval = 10000;


setInterval(function() {
    var res = excel.getPerTime(seconds);
    if (res){
        var data = JSON.stringify(res);
        console.log(data);
        request({
            uri: "http://localhost:3000/harvest",
            method: "POST",
            form: {
                data: data
            },
        }, function(error, response, body) {
            console.log(body);
        });
    }
}, the_interval);




