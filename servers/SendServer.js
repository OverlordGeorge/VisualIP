var request = require("request");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 3010;
var fs = require('fs');

server.listen(port, function () {
    console.log("server is running on port: ", port);
});

var seconds = 25;
var the_interval = 10000;
let logs = [];
let step = 10;
let count = 0;

fs.readFile('../data/logs/roomsmontreal/access.txt', 'utf-8', (err, data) => {

    logs = data.split('\n');
    setInterval(function () {
        let data = logs.slice(count, count+step);
        request({
            uri: "http://localhost:3000/saveLog",
            method: "POST",
            json: true,
            form: {
                data: data
            },
        }, function (error, response, body) {
            console.log(body);
        });
        count += step;
        if (count + step >= logs.length) {
            count = 0;
        }
    }, the_interval);

})

