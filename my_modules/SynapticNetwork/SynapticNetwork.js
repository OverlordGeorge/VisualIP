let synaptic = require('synaptic');
let Architect = synaptic.Architect;
let Trainer = synaptic.Trainer;


class SynapticNetwork{

    constructor(){
        this.network = null;
        this.trainer = null;


    }

    createAndPrepareNetwork(trainingSet){
        this.createNetwork();
        this.prepareNetwork(trainingSet);
    }

    createNetwork(){
        this.network = new Architect.Perceptron(2, 2, 1);
        this.trainer = new Trainer(this.network);
    }

    prepareNetwork(trainingSet){
        this.trainNetwork(trainingSet);
    }

    trainNetwork(trainingSet){
        this.trainer.train(trainingSet);
    }

    calculateMultipleObjects(dataArr){
        let res = [];
        dataArr.forEach(elem =>{
            let singleObject = this.calculateSingleObject(elem);
            res.push(singleObject);
        });
        return res;
    }

    calculateSingleObject(data){
        return this.network.activate(data);
    }

}

module.exports.SynapticNetwork = SynapticNetwork;