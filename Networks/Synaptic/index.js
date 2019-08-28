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

trainer.train(trainingSet);
let res = myNetwork.activate([0, 0]);
console.log(res);