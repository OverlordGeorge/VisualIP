let Tail = require('tail').Tail;
let http = require('http');

let path = "/var/log/nginx/access.log";
let tail = new Tail(path);
let logReceiverUrl = "http://89.105.140.135";


function sendData(data, url){
    let jsonData = JSON.stringify(data);
    let options = {
      method: 'POST',
        port: 3000,
        headers:{
            'Content-Type': 'application/json',
            'Content-Length': jsonData.length
        }
    };
    let req = http.request(url, options, function (response) {
        console.log("code status: "+response.statusCode);
    });
    req.end();
}

tail.on("line", function(data) {
    //console.log(data);
    sendData(data, logReceiverUrl);
});