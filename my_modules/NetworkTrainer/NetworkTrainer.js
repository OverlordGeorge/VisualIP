let DataPrepareModule = require('../../my_modules/DataPrepareModule/DataPrepareModule').DataPrepareModule;
let SynapticNetwork = require('../../my_modules/SynapticNetwork/SynapticNetwork').SynapticNetwork;

export class NetworkTrainer {
    constructor(){
        this.dataPrepareModule = new DataPrepareModule();
        let synapticNetwork = new SynapticNetwork();
    }


}