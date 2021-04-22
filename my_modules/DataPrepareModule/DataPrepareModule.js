let DataConverter = require('../DataConverter/DataConverter').DataConverter;
let IpScout = require('../IpScout').IpScout;
let UserAgentAnalyzer = require('../UserAgentAnalyzer/UserAgentAnalyzer').UserAgentAnalyzer;

class DataPrepareModule{
    constructor(fields = ['time_local', 'status', 'body_bytes_sent', 'http_user_agent']){
        this.dataConverter = new DataConverter();
        this.existedField = fields;
        this.IpInfoScout = new IpScout();
        this.userAgentAnalyzer = new UserAgentAnalyzer();
    }

    prepareSeveralObjects(arrayOfObjs){
        let resArr = [];
        let self = this;
        arrayOfObjs.forEach(function (obj) {
            let newObj = self.prepareSingleObject(obj);
            resArr.push(newObj);
        });
        return resArr;
    }

    prepareSingleObject(obj){
        let filteredIpObject = this.convertExistedFields(obj);
        return this.getAdditionalIpInfo(filteredIpObject);
    }


    convertExistedFields(obj){
        let newObj={};
        let time = this.existedField[0];
        let status = this.existedField[1];
        let bodyB = this.existedField[2];
        let userAgent = this.existedField[3];
        if (obj[time]){
            newObj[time] = this.dataConverter.utcToUnix(obj[time]);
        }
        if (obj[status]){
            newObj[status] = this.dataConverter.strToDecimal(obj[status]);
        }
        if (obj[bodyB]){
            newObj[bodyB] = this.dataConverter.logarithm(obj[bodyB]);
        }
        if (obj[userAgent]){
            newObj[userAgent] = this.userAgentAnalyzer.isRobotUserAgent(obj[userAgent]) ? 1 : 0;
        } else{
            newObj[userAgent] = 0;
        }
        if (obj['ip_str']){
            newObj['ip'] = obj['ip_str'];
        }
        return newObj;
    }

    getAdditionalIpInfo(preparedObj) {
        let completeIpObject = this.getGeoInfoAbout(preparedObj);
        return completeIpObject;
    }

    getGeoInfoAbout(IpObject){
        let geoData = this.IpInfoScout.getGeoIpInfo(IpObject.ip);
        IpObject['country'] = this.IpInfoScout.getCountryDecimalCode(geoData['country']);
        IpObject['coordinates'] = geoData['ll'];
        return IpObject;
    }

    findAllBlacklistedIPFrom(ipsArray, blacklistedIpArray){
        ipsArray.forEach(function (elem) {
            if (!blacklistedIpArray.includes(elem.ip)) {
                elem.good = 1;
            } else{
                elem.good = 0;
            }
        });
        return ipsArray;
    }

    prepareForNetwork(dataArray, inputNetworkFields, outputNetworkFields){
        let res = [];
        dataArray.forEach(elem =>{
            let trainObject = {
                input:[],
                output: []
            };
            let fields = Object.keys(elem);
            fields.forEach( field =>{
                if (inputNetworkFields.includes(field)){
                    trainObject.input.push(parseInt(elem[field]));
                }
                else if (outputNetworkFields.includes(field)){
                    trainObject.output.push(parseInt(elem[field]));
                }
            });
            res.push(trainObject);
        });
        return res;
    }

    clearIp(unparsedIp){
        return unparsedIp.replace(/[^0-9.]/g, '');
    }
}

module.exports.DataPrepareModule = DataPrepareModule;

