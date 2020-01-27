let express=require('express');
let app=express();
let server=require('http').createServer(app);
const bodyParser = require("body-parser");

let port = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

server.listen(port,function(){
    console.log("server is running on port: ",port);
});

app.post("/saveLog", function (req, res) {
    console.log(req.body);
    res.status(200).send({"message": "Ok"});
});

app.get("/saveLog", function (req, res) {
    console.log(req.query);
    res.status(200).send({"message": "Ok"});
});