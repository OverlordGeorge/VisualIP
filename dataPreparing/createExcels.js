let xlsx = require('xlsx');
let fs = require('fs');

let sourceFile = './data/spamtest.xlsx';
let nameMatrix = './dataPreparing/jsons/nameMatrix.json';
let dataMatrix = './dataPreparing/jsons/dataMatrix.json';

let outputNameMatrix = './dataPreparing/results/nameMatrix.xlsx';
let outputDataMatrix = './dataPreparing/results/dataMatrix.xlsx';

let book = xlsx.utils.book_new();

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
    let num = 0;
    for (let i = 0; i < nameMatrix.length; i++) {
        let name = nameMatrix[i].name;
        let obj = {
            desc: nameMatrix[i].desc,
            name: name,
            num: i+1
        };
        valuesArr.push([]);
        valuesArr[i].push("K"+i);
        if (nameMatrix[i].link) {
            for (let j = 0; j < excelData.length; j++) {
                let value = getValueFromExcel(nameMatrix[i], excelData[j]);
                valuesArr[num].push(value);
            }
            num++;
        }
        nameArr.push(obj);
    }
    createNameMatrixExcel(nameArr);
    // createDataMatrixExcel(valuesArr);
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
    let prepArr = prepareNameMatrixForExcel(arr);
    let ws = xlsx.utils.json_to_sheet(prepArr);
    xlsx.utils.book_append_sheet(book,ws, "List One")
    //var buf = XLSX.write(wb, {type:'buffer', bookType:bookType || "xlsx"});
    let buf = xlsx.writeFile(book, outputNameMatrix);
    return buf;
}

function createDataMatrixExcel(arr) {
    let wb = xlsx.utils.json_to_sheet(arr);
    console.log(1);
}


make();

let arr1 = [1, 2, 3];
/*let arr2 = [[1, 2, 3], ["a", "b", "c"]];
let res1 = xlsx.utils.json_to_sheet(arr1);
let res2 = xlsx.utils.json_to_sheet(arr2);*/
