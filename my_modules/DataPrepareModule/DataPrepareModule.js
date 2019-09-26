let DataConverter = require('../DataConverter/DataConverter').DataConverter;
let IpScout = require('../IpScout').IpScout;

class DataPrepareModule{
    constructor(fields = ['time_local', 'status', 'body_bytes_sent']){
        this.dataConverter = new DataConverter();
        this.existedField = fields;
        this.IpInfoScout = new IpScout();
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
        let fullfieldIpObject = this.getAdditionalIpInfo(filteredIpObject);
        return fullfieldIpObject;
    }


    convertExistedFields(obj){
        let newObj={};
        let time = this.existedField[0];
        let status = this.existedField[1];
        let bodyB = this.existedField[2];
        if (obj[time]){
            newObj[time] = this.dataConverter.utcToUnix(obj[time]);
        }
        if (obj[status]){
            newObj[status] = this.dataConverter.strToDecimal(obj[status]);
        }
        if (obj[bodyB]){
            newObj[bodyB] = this.dataConverter.logarithm(obj[bodyB]);
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
}

module.exports.DataPrepareModule = DataPrepareModule;

