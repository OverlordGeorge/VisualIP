let parser = require('parse-whois');

module.exports = class WhoisParser{
    constructor(){
    }

    getFirstParsing(data){
        return parser.parseWhoIsData(data);
    }

    deleteSpaces(str){
        let st=0;
        let end=str.length;
        for (let i=0;i<str.length;i++)
            if (str[i]!==" ")
            {
                st=i;
                break;
            }
        for (let i=str.length-1;i>st;i++)
            if (str[i]!==" ") {
                end = i;
                break;
            }
        let res = str.substr(st,end+1);
        return res;
    }

    findSpecificField(field, text){
        let data = this.getFirstParsing(text);
        for (let i = 0;i<data.length;i++) {
            if (data[i]["attribute"] && data[i]["value"]) {
                let name = this.deleteSpaces(data[i]["attribute"]);
                let value = data[i]["value"];
                if (field===name)
                    return value;
            }
        }
        return false;
    }

    sortData(data){
        let res = [];
        for (let i = 0;i<data.length;i++) {
            if (data[i]["attribute"] && data[i]["value"]) {
                let name = this.deleteSpaces(data[i]["attribute"]);
                let value = data[i]["value"];
                if (res[name]) {
                    res[name] += " " + '\n' + value;
                }
                else {
                    res[name] = value;
                }
            }
        }
        return res;
    }

    getSortedList(data){
        let unsorted = this.getFirstParsing(data);
        let sorted = this.sortData(unsorted);
        return sorted;
    }

}
