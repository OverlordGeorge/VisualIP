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
let DataLogReceiver = require('./my_modules/DataLogReceiver/DataLogReceiver').DataLogReceiver;
let MongoHandler = require('./my_modules/MongoHandler/MongoHandler').MongoHandler;
let IpInformer = require('./my_modules/IpInformer/IpInformer').IpInformer;

//my network
let networkHandler = new NetworkHandler();
let dataPrepareModule = new DataPrepareModule();

networkHandler.createNetworkFromLog(__dirname + config.network.trainingFile, () => {
    console.log("done training");
    networkHandler.checkNetwork(__dirname + '/data/logs/tactravels/access.txt');
});

app.use("/node_modules", express.static(__dirname + "/node_modules/"));
app.use("/", express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

server.listen(config.server.port, function () {
    console.log("server is running on port: " + config.server.port);
});

MongoClient.connect(config.mongo.url, function (err, connection) {

    let db = connection.db(config.mongo.db);
    let ipsColl = db.collection("Ips");

    let mongoHandler = new MongoHandler(db);
    let dataLogReceiver = new DataLogReceiver(dataPrepareModule, networkHandler, mongoHandler);
    let ipInformer = new IpInformer(ipsColl);

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

        socket.on('getIpInfo', function (ip) {
            if (ip && ip !== ""){
                ipInformer.getFullIpInfo(ip, (data) => {
                    io.to(socket.id).emit('ipInfo', JSON.stringify(data));
                })
            }
        })

        app.post("/saveLog", function (req, res) {
            if (req.body.data) {
                dataLogReceiver.saveLog(req, (fullInfo) => {
                    io.sockets.emit("getNewSignals", JSON.stringify(fullInfo));
                })
            }
            res.status(200).send({"message": "Ok"});
        });

        app.get("/saveLog", function (req, res) {
            res.status(200).send({"message": "Ok"});
        });

    });


});

