let LogParser = require('../LogParser/LogParser').LogParser;
let DataPrepareModule = require('../DataPrepareModule/DataPrepareModule').DataPrepareModule;
let SynapticNetwork = require('../SynapticNetwork/SynapticNetwork').SynapticNetwork;
let NetworkAnalyzer = require('../NetworkAnalyzer/NetworkAnalyzer').NetworkAnalyzer;
let fs = require('fs');

class NetworkHandler {

    constructor() {
        this.nginxParser = new LogParser('$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');
        this.dataPrepareModule = new DataPrepareModule();
        this.network = new SynapticNetwork();
        this.blackIpsPath = './data/blackip.txt';
        this.blackIpList = this.getBlackIpsSync();
        this.networkAnalyzer = new NetworkAnalyzer();
    }

    prepareObjectForNetwork(obj){
        let arr = [];
        arr.push(obj['status']);
        arr.push(obj['body_bytes_sent']);
        arr.push(obj['country']);
        return arr;
    }

    getIpInfo(line, callback) {
        this.nginxParser.parseLine(line, (obj) => {
            let newObjInfo = this.dataPrepareModule.prepareSingleObject(obj);
            newObjInfo['blackListAns'] = this.getBlackIpListAnswer(obj);
            newObjInfo['networkAns'] = this.getSingleNetworkAnswer(this.prepareObjectForNetwork(obj));
            callback(newObjInfo);
        })
    }

    getBlackIpListAnswer(obj) {
        let arr = this.dataPrepareModule.findAllBlacklistedIPFrom([obj], this.blackIpList);
        return arr[0]['good'];
    }

    getSingleNetworkAnswer(obj) {
        return  Math.round(this.network.calculateSingleObject(obj[0]));
    }

    createNetworkFromLog(path, callback) {
        this.nginxParser.parseAndPrepareLog(path, (data) => {
            this.parseLogData(data, (preparedNetworkData) => {
                this.createAndTrainNetwork(preparedNetworkData);
                callback();
            })
        })
    }

    createAndTrainNetwork(trainingSet) {
        let preparedTrainingSet = this.dataPrepareModule.prepareForNetwork(trainingSet, ['status', 'body_bytes_sent', 'country'], ['good']);
        this.network.createAndPrepareNetwork(preparedTrainingSet);
    }

    getBlackIpsSync() {
        let data = fs.readFileSync(this.blackIpsPath, 'utf8');
        let str = data.toString();
        return str.split('\n');
    }

    parseLogData(logData, callback) {
        let parsedIpArray = this.dataPrepareModule.prepareSeveralObjects(logData);
        try {
            let blacklistedIps = this.getBlackIpsSync();
            let markedIpArray = this.dataPrepareModule.findAllBlacklistedIPFrom(parsedIpArray, blacklistedIps);
            callback(markedIpArray);
            // trainNetwork(markedIpArray);
        } catch (e) {
            console.log('Error:', e.stack);
        }
    }


    checkNetwork(testFilePath) {
        this.nginxParser.parseAndPrepareLog(testFilePath, (data) => {
            let parsedIpArray = this.dataPrepareModule.prepareSeveralObjects(data);
            try {
                let blacklistedIps = this.getBlackIpsSync();
                let checkArray = this.dataPrepareModule.findAllBlacklistedIPFrom(parsedIpArray, blacklistedIps);
                let diffRes = 0;
                for (let i = 0; i < checkArray.length; i++) {
                    let preparedArr = [checkArray[i]['status'], checkArray[i]['body_bytes_sent'], checkArray[i]['country']];
                    let singleRes = this.network.calculateSingleObject(preparedArr);
                    let diff = Math.abs(Math.round(singleRes) - checkArray[i]['good']);
                    diffRes += diff;
                }
                this.networkAnalyzer = new NetworkAnalyzer(diffRes, checkArray.length);
                console.log("amount of test objects " + checkArray.length);
                console.log("amount of mistakes " + diffRes);
                let percent = (diffRes / checkArray.length) * 100;
                console.log("percent of mistakes: " + percent + "%");
            } catch (e) {
                console.log('Error:', e.stack);
            }
        });
    }
}

module.exports.NetworkHandler = NetworkHandler;
