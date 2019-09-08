let DataConverter = require('../DataConverter/DataConverter');

class DataPrepareModule{
    constructor(fields = ['time_local']){
        this.dataConverter = new DataConverter();
        this.existedField = fields;
    }

    prepareSingleObject(obj){

    }

    convertExistedFields(obj, ){

    }
}

module.exports.DataPrepareModule = DataPrepareModule;

