let NginxParser = require('nginxparser');

class LogParser {

    constructor(options = '$http_client_ip $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$upstream_response_time" $request_time $host $upstream_status $upstream_addr $http_deviceType $http_productId $http_appVersion $http_market') {
        this.options = options;
        this.parser = new NginxParser(this.options);
    }

    filterNulls(obj){
        let keys = Object.keys(obj);
        let newObj = {};
        keys.forEach(function (name) {
            if (obj[name]){
                if (obj[name]!=="" && obj[name]!==null){
                    newObj[name] = obj[name];
                }
            }
        });
        if ((Object.keys(newObj)).length>0){
            return newObj;
        }
        else return false;
    }

    filterObject(obj){
        let newObj = this.filterNulls(obj);
        if (!newObj) return false;
        return newObj;
    }

    prepareData(data, callback){
        let resArr = [];
        let self = this;
        data.forEach(function (elem) {
            let newObj = self.filterObject(elem);
            if (newObj){
                resArr.push(newObj);
            }
        });
        callback(resArr);
    }

    parseLogFile(path, callback){
        let resArr = [];
        this.parser.read(path, function (row) {
            resArr.push(row);
        }, function (err) {
            if (err) throw err;
            callback(resArr);
        });
    }
    
    parseAndPrepareLog(path, callback){
        let self =this;
        this.parseLogFile(path, function (data) {
           self.prepareData(data, callback);
        })
    }


    parseLine(line, callback) {
        this.parser.parseLine(line, (parsedLine) =>{
            let finishObj = this.filterNulls(parsedLine);
            callback(finishObj);
        })
    };
}

module.exports.LogParser = LogParser;
