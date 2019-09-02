let synaptic = require('synaptic');
let Architect = synaptic.Architect;
let Trainer = synaptic.Trainer;


var myNetwork = new Architect.Perceptron(2, 2, 1);
var trainer = new Trainer(myNetwork);

var trainingSet = [
    {
        input: [1, 1],
        output: [1]
    },
    {
        input: [0, 1],
        output: [0]
    },
    {
        input: [1, 0],
        output: [0]
    },
    {
        input: [0, 0],
        output: [0]
    },
];

/*trainer.train(trainingSet);
let res = myNetwork.activate([0, 0]);
console.log(res);*/

let SimpleReader = require('../../my_modules/excelReader/SimpleReader').SimpleReader;
let DataConverter = require('../../my_modules/DataConverter/DataConverter').DataConverter;
let LogParser = require('../../my_modules/LogParser/LogParser').LogParser;

let excelClass = new SimpleReader();
let dataConverter = new DataConverter();
let nginxParser = new LogParser('$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');


nginxParser.parseAndPrepareLog(__dirname+'/data/access.txt', function (data) {
    console.log(data);
});
