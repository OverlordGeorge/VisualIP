let DataConverter = require('../DataConverter/DataConverter').DataConverter;

class DataPrepareModule{
    constructor(fields = ['time_local', 'status', 'body_bytes_sent']){
        this.dataConverter = new DataConverter();
        this.existedField = fields;
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
        let filteredObj = this.convertExistedFields(obj);
        return filteredObj;
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
        return newObj;
    }
}

module.exports.DataPrepareModule = DataPrepareModule;

