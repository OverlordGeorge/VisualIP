let synaptic = require('synaptic');
let Architect = synaptic.Architect;
let Trainer = synaptic.Trainer;

var myNetwork = new Architect.Perceptron(2, 2, 1);
var trainer = new Trainer(myNetwork);

/*var trainingSet = [
    {
        input: [1, 1],
        output: [1]
    },
    {
        input: [1, 0],
        output: [0]
    },
    {
        input: [0, 1],
        output: [0]
    },
    {
        input: [0, 0],
        output: [1]
    },
];

trainer.train(trainingSet);
let res = myNetwork.activate([1, 0]);
console.log(res);*/

let xlsx = require('xlsx');
let fs = require('fs');

let letter = "P";
let dbo;
let dbData = [];
let sourceFile = './data/data70.xlsx';
let nameMatrix = './dataPreparing/jsons/nameMatrix.json';
let dataMatrix = './dataPreparing/jsons/dataMatrix.json';

let outputNameMatrix = './dataPreparing/results/nameMatrix1.xlsx';
let outputDataMatrix = './dataPreparing/results/dataMatrix1.xlsx';

let book = xlsx.utils.book_new();

let nameHeaders = ['num', 'meaning'];
let valueHeaders = ['num'];

function getDataFromExcel(file) {
    let workbook = xlsx.readFile(file);
    let sheet_name_list = workbook.SheetNames;
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
}

console.log(getDataFromExcel())