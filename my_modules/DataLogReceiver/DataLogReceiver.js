let DataPrepareModule = require('../DataPrepareModule/DataPrepareModule').DataPrepareModule;

class DataLogReceiver{
    constructor(DPModule, NWHandler, mongoHandler){
        this.dataPrepareModule = DPModule;
        this.networkHandler = NWHandler;
        this.mongoHandler = mongoHandler;
    }

    setDestination(req){
        if (req.connection.remoteAddress) {
            let ip = this.dataPrepareModule.clearIp(req.connection.remoteAddress);
            let ipInfo = this.dataPrepareModule.IpInfoScout.getGeoIpInfo(ip);
            if (ipInfo !== false) {
                ipInfo['ip'] = ip;
            } else{
                ipInfo = {
                    'ip': ip
                }
            }
            console.log("received log form: "+ip);
            return ipInfo;
        } else {
            return false;
        }
    }

    saveLog(req, callback){
        this.networkHandler.getIpInfo(req.body.data, (source) => {
            let dest = this.setDestination(req);
            let fullInfo = {
                "source": source,
                "dest": dest
            };
            this.mongoHandler.insertOne("Ips", fullInfo);
            this.networkHandler.networkAnalyzer.eatNetworkObject(source, dest);
            callback(fullInfo);
        })
    }

}

module.exports.DataLogReceiver = DataLogReceiver;

