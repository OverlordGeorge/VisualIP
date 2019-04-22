let xlsx = require('xlsx');
let fs = require('fs');

let letter = "P";

let sourceFile = './data/spamtest.xlsx';
let nameMatrix = './dataPreparing/jsons/nameMatrix.json';
let dataMatrix = './dataPreparing/jsons/dataMatrix.json';

let outputNameMatrix = './dataPreparing/results/nameMatrix.xlsx';
let outputDataMatrix = './dataPreparing/results/dataMatrix.xlsx';

let book = xlsx.utils.book_new();

let nameHeaders = ['num', 'meaning'];
let valueHeaders = ['num'];

function getDataFromExcel(file) {
    let workbook = xlsx.readFile(file);
    let sheet_name_list = workbook.SheetNames;
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
}

function readJSON(path, callback) {
    fs.readFile(path, function (err, data) {
        if (err) {
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
    if (elem[name]) {
        let value = elem[name];
        if (column.values) {
            if (column.values.includes(value)) {
                return column.values.indexOf(value);
            }
        }
        return value;
    }
    return "";
}

function startCreating(excelData, nameMatrix) {
    let nameArr = [];
    let valuesArr = [];
    for (let i = 0; i < nameMatrix.length; i++) {
        let name = nameMatrix[i].name;
        let obj = {
            desc: nameMatrix[i].desc,
            name: name,
            num: i+1,
            meaning: letter +(i+1)
        };
        nameArr.push(obj);
    }

    for (let j = 0; j < excelData.length; j++) {
        let obj = {};
        for (let i = 0; i < nameMatrix.length; i++) {
            let name = nameMatrix[i].name;
            let value = getValueFromExcel(nameMatrix[i], excelData[j]);
            obj[name] = value;
        }
        obj['num'] = j+1;
        valuesArr.push(obj);
    }
    createNameMatrixExcel(nameArr);
    createDataMatrixExcel(valuesArr, nameArr);
}

function prepareNameMatrixForExcel(arr) {
    let res = [];
    res.length = arr.length;
    for (let i = 0; i < arr.length; i++) {
        res[i] = [];
        res[i].push(arr[i].name);
        res[i].push(arr[i].desc);
    }
    return res;
}

function createNameMatrixExcel(arr) {
    let headers = nameHeaders.splice(["name","desc"]);
    let ws = xlsx.utils.json_to_sheet(arr, {header:headers});
    xlsx.utils.book_append_sheet(book,ws, "List One");
    let buf = xlsx.writeFile(book, outputNameMatrix);
    return buf;
}

function createDataMatrixExcel(arr , nameMatrix) {
    let nameArr = [];
    for (let i=0;i<nameMatrix.length;i++){
        let name = nameMatrix[i].name;
        nameArr.push(name);
    }
    let headers = ['num'].splice(nameArr);
    let ws = xlsx.utils.json_to_sheet(arr, {header:headers});
    xlsx.utils.book_append_sheet(book,ws, "List Two");
    let buf = xlsx.writeFile(book, outputNameMatrix);
    return buf;
}

make();

/*function test() {
    let ws = xlsx.utils.json_to_sheet([
        { S:1, h:2, e:3, e_1:4, t:5, J:6, S_1:7 },
        { S:2, h:3, e:4, e_1:5, t:6, J:7, S_1:8 }
    ], {header:["S","h","e","e_1","t","J","S_1"]});
    xlsx.utils.book_append_sheet(book,ws, "List One");
    let buf = xlsx.writeFile(book, outputNameMatrix);
}

test();*/