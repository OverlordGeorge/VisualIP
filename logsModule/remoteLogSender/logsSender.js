let Tail = require('tail').Tail;
let http = require('http');
let request = require('request');

let path = "/var/log/nginx/access.log";
let tail = new Tail(path);
let logReceiverUrl = "http://134.209.205.172:3000/saveLog";


function sendData(data) {
    let opt = {
        method: 'POST',
        uri: logReceiverUrl,
        json: true,
        body: {
            log: data
        }
    };
    request(opt);
}

tail.on("line", function (data) {
    sendData(data, logReceiverUrl);
});