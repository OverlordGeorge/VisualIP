
let SigmoidFunction = require('../function/SigmoidFunction');

class Network{
    constructor(input = 2, output = 1, hidden = 1, func = new SigmoidFunction(1)) {
        this.inputLayers = input;
        this.outputLayers = output;
        this.hiddenLayers = [];
        for (let i=0;i<hidden;i++){
            this.hiddenLayers.push([]);
        }

    }

    randomizeWeight(from = 0, to = 1){
        let weight = Math.random()*(to - from) + from;
        return weight;
    }

    randomizeWeights(num, from = 0, to = 1){
        let weights = [];
        let self = this;
        for (let i=0;i<num; i++){
            weights.push(self.randomizeWeight(from, to));
        }
        return weights;
    }

    prepareNetwork(num, from = 0, to = 1){
        let self = this;
        for (let i=0;i<self.hiddentLayers;i++){
            self.hiddenLayers[i] = self.randomizeWeights(num, from, to);
        }
    }

}

module.exports.Network = Network;