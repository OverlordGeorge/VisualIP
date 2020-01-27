//libraries
let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let bodyParser = require('body-parser');

//config file
let config = require('./config.json');

//my modules
let NetworkHandler = require('./my_modules/NetworkHandler/NetworkHandler').NetworkHandler;
let DataPrepareModule = require('./my_modules/DataPrepareModule/DataPrepareModule').DataPrepareModule;

//my network
let networkHandler = new NetworkHandler();
let dataPrepareModule = new DataPrepareModule();
networkHandler.createNetworkFromLog(__dirname + config.network.trainingFile, () => {
    console.log("done training");
    networkHandler.checkNetwork(__dirname + '/data/logs/tactravels/access.txt');
});

function setDest(req) {
    if (req.connection.remoteAddress) {
        let ip = dataPrepareModule.clearIp(req.connection.remoteAddress);
        let ipInfo = dataPrepareModule.IpInfoScout.getGeoIpInfo(ip);
        ipInfo['ip'] = ip;
        return ipInfo;
    } else {
        return false;
    }
}

app.use("/node_modules", express.static(__dirname + "/node_modules/"));
app.use("/", express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

server.listen(config.server.port, function () {
    console.log("server is running on port: " + config.server.port);
});

MongoClient.connect(config.mongo.url, function (err, db) {
    if (err) {
        console.log("cant connect to Mongo");
        throw err;
    } else {
        console.log("connected to db");
    }

    io.sockets.on('connection', function (socket) {

        console.log('user connected, id: ', socket.id);
        io.to(socket.id).emit('sayHi', "welcome to server");

        socket.on('networkInfo', function () {
            let data = networkHandler.networkAnalyzer.getFullInfo();
            io.to(socket.id).emit('getNetworkInfo', JSON.stringify(data));
        });

        app.post("/saveLog", function (req, res) {
            if (req.body.data) {
                networkHandler.getIpInfo(req.body.data, (source) => {
                    let dest = setDest(req);
                    let fullInfo = {
                        "source": source,
                        "dest": dest
                    };
                    networkHandler.networkAnalyzer.eatNetworkObject(source, dest);
                    io.sockets.emit("getNewSignals", JSON.stringify(fullInfo));
                })
            }
            res.status(200).send({"message": "Ok"});
        });

        app.get("/saveLog", function (req, res) {
            res.status(200).send({"message": "Ok"});
        });

        /*socket.on('countryInfo',function(name){
            informer.countryInfo(name,function(data){
                if (data){
                    io.to(socket.id).emit('getCountryInfo', JSON.stringify(data));
                }
            })
        });

        sendPercents = function(data){
            io.to(socket.id).emit('getCountryPercents', JSON.stringify(data));
        };

        refreshInfo = function(){
            io.to(socket.id).emit('getIpStack', currIps);
        }*/
    });


});

