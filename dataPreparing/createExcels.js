let xlsx = require('xlsx');
let fs = require('fs');

let sourceFile = './data/spamtest.xlsx';
let nameMatrix =  './dataPreparing/jsons/nameMatrix.json';
let dataMatrix = './dataPreparing/jsons/dataMatrix.json';

function getDataFromExcel(file) {
    let workbook = xlsx.readFile(file);
    let sheet_name_list = workbook.SheetNames;
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
}

function createDataMatrix(excelData, nameMatrixPath) {

}

function readJSON(path, callback) {
    fs.readFile(path, function(err, data) {
        if (err){
            console.log("error with file");
        }
        callback(JSON.parse(data));
    });
}

function make() {
    let excelData = getDataFromExcel(sourceFile);
    readJSON(nameMatrix, function (data) {
            startCreating(excelData, data);
    })

}

function getValueFromExcel(column, elem) {
    let name = column.link;
    if (elem[name]){
        let value = elem[name];
        if (column.values){
            if (column.values.includes(value)){
                return column.values.indexOf(value);
            }
        }
        return value;
    }
    return "";
}

function startCreating(excelData, nameMatrix){
    let res = {

    };
    for (let i=0;i<nameMatrix.length;i++){
        let name = nameMatrix[i].name;
        res[name] = [];
        for (let j=0;j<excelData.length;j++){
            let value = getValueFromExcel(nameMatrix[i], excelData[j]);
            res[name].push(value);
        }
    }
    console.log(res);
}

make();
