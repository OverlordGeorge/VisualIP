var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var port=3000;

server.listen(port,function(){
    console.log("server is running on port: ",port);
});

app.use(express.static(__dirname +'/public'));
//app.use(express.static(__dirname +'/bower_components'));
