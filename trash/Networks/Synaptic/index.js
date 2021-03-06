//read from file modules

var fs = require('fs');

//network modules
let synaptic = require('synaptic');
let Architect = synaptic.Architect;
let Trainer = synaptic.Trainer;

//my modules
let SimpleReader = require('../../my_modules/excelReader/SimpleReader').SimpleReader;
let DataConverter = require('../../my_modules/DataConverter/DataConverter').DataConverter;
let LogParser = require('../../my_modules/LogParser/LogParser').LogParser;
let DataPrepareModule = require('../../my_modules/DataPrepareModule/DataPrepareModule').DataPrepareModule;
let SynapticNetwork = require('../../my_modules/SynapticNetwork/SynapticNetwork').SynapticNetwork;

let excelClass = new SimpleReader();
let dataConverter = new DataConverter();
let nginxParser = new LogParser('$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');
let dataPrepareModule = new DataPrepareModule();
let synapticNetwork = new SynapticNetwork();

function checkNetworkAnswers(checkArray) {
    let diffRes = 0;
    for (let i=0;i<checkArray.length;i++){
        let preparedArr = [checkArray[i]['status'], checkArray[i]['body_bytes_sent'], checkArray[i]['country']];
        let singleRes = synapticNetwork.calculateSingleObject(preparedArr);
        let diff = Math.abs(Math.round(singleRes) - checkArray[i]['good']);
        diffRes+=diff;
    }
    console.log("amount of test objects "+checkArray.length);
    console.log("amount of mistakes "+diffRes);
    let percent = (diffRes/checkArray.length)*100;
    console.log("percent of mistakes: "+percent+"%");
}

function testNetwork() {
    //{"time_local":1567147073,"status":400,"body_bytes_sent":5,"ip":"41.251.86.130","country":504,"good":false}
    //let testData = [400, 5, 504];
    //let res = synapticNetwork.calculateSingleObject(testData);
    //console.log(res);
    nginxParser.parseAndPrepareLog(__dirname+'/data/accessTactravels.txt', function (data) {
        let parsedIpArray = dataPrepareModule.prepareSeveralObjects(data);
        try {
            let data = fs.readFileSync('./data/blackip.txt', 'utf8');
            let str = data.toString();
            let blacklistedIps = str.split('\n');
            let markedIpArray = dataPrepareModule.findAllBlacklistedIPFrom(parsedIpArray, blacklistedIps);
            checkNetworkAnswers(markedIpArray);
        } catch(e) {
            console.log('Error:', e.stack);
        }
    });
}

function trainNetwork(trainingSet){
    console.log(trainingSet);
    let preaparedTrainingSet = dataPrepareModule.prepareForNetwork(trainingSet, ['status', 'body_bytes_sent', 'country'], ['good']);
    //console.log(preaparedTrainingSet);
    synapticNetwork.createAndPrepareNetwork(preaparedTrainingSet);
    console.log("trained");
    testNetwork();
}

nginxParser.parseAndPrepareLog(__dirname+'/data/accessMap.txt', function (data) {
    let parsedIpArray = dataPrepareModule.prepareSeveralObjects(data);
    try {
        let data = fs.readFileSync('./data/blackip.txt', 'utf8');
        let str = data.toString();
        let blacklistedIps = str.split('\n');
        let markedIpArray = dataPrepareModule.findAllBlacklistedIPFrom(parsedIpArray, blacklistedIps);
        console.log("amount of ips: "+markedIpArray.length);
        trainNetwork(markedIpArray);
    } catch(e) {
        console.log('Error:', e.stack);
    }
});
