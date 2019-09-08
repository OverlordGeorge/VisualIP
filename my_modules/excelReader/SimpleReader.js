var fs = require('fs');
var xlsx = require('xlsx');

class SimpleReader {

    constructor(){

    }

    /*
    use this function to get JSON from file
     */
    parseExcel(name){
        let data = this.getFileData(name);
        let res = this.excelToJSON(data);
        return res;
    }

    getFileData(name){
        let workbook = xlsx.readFile(name);
        let sheet_name_list = workbook.SheetNames;
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        return data;
    }

    excelToJSON(data){
        let objects = [];
        for (let i=0;i<data.length;i++){
            let obj={};
            obj['ip'] = data[i].IP;
            if (data[i].LENGTH)
                obj['length'] = data[i].LENGTH;
            obj['from']  = data[i].FROM;
            obj['to'] = data[i].TO;
            obj['time'] = new Date(data[i].DATE+" "+data[i].TIME).getTime()/1000;
            obj['host'] = data[i].HOSTNAME;
            obj['whymark'] = data[i].WHYMARK;
            objects.push(obj);
        }
        return objects;
    }
}

module.exports.SimpleReader = SimpleReader;
