
let SigmoidFunction = require('../function/SigmoidFunction');

module.exports = class Network{
    constructor(input = 2, output = 1, hidden = 1, func = new SigmoidFunction(1)) {
        this.inputLayers = input;
        this.output = output;
        this.outputLayer = [];
        this.hiddenLayers = [];
        this.hiddenLayersOutputs = [];
        for (let i=0;i<hidden;i++){
            this.hiddenLayers.push([]);
        }
        this.func = func;
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

    prepareLayer(numOfOuts, numOfNeurons, from = 0, to = 1){
        let res = [];
        let self = this;
        for (let i=0;i<numOfNeurons;i++){
            let weights = self.randomizeWeights(numOfOuts, from, to);
            res.push(weights);
        }
        return res;
    }

    prepareNetwork(num, from = 0, to = 1){
        let self = this;
        this.hiddenLayers[0] = this.prepareLayer(self.inputLayers, num, from, to);
        for (let i=1;i<this.hiddenLayers.length;i++){
            this.hiddenLayers[i] = this.prepareLayer(num, num, from, to);
        }
        let ins = this.hiddenLayers[this.hiddenLayers.length-1].length;
        this.outputLayer = this.prepareLayer(ins, this.output, from , to);
    }

    executeNeuron(arrOfData, neuronX, neuronY){
        let res = 0;
        let weights = this.hiddenLayers[neuronX][neuronY];
        for (let i=0;i<arrOfData.length;i++){
            res+= weights[i] * arrOfData[i];
        }
        let neuroOut = this.func.execute(res);
        return neuroOut;
    }

    executeLayer(dataArr, num){
        let newData = [];
        let self = this;
        let layer = this.hiddenLayers[num];
        for (let i=0;i<layer.length;i++){
            newData.push(self.executeNeuron(dataArr, num, i));
        }
        return newData;
    }

    backPropagation(dataArr){

    }

    executeOutputNeiron(dataArr, neuronY){
        let res = 0;
        let weights = this.outputLayer[neuronY];
        for (let i=0;i<dataArr.length;i++){
            res+= weights[i] * dataArr[i];
        }
        let neuroOut = this.func.execute(res);
        return neuroOut;
    }

    executeOutput(dataArr){
        let res = [];
        let self = this;
        for (let i=0;i<this.outputLayer.length;i++){
            res.push(self.executeOutputNeiron(dataArr, i));
        }
        return res;
    }

    executeNetwork(dataArr){
        let output = dataArr;
        let resArr = [];
        for (let i=0;i<this.hiddenLayers.length;i++){
            output = this.executeLayer(output, i);
            this.hiddenLayersOutputs[i]=output;
            resArr.push(output);
        }
        let finalRes = this.executeOutput(output);
        resArr.push(finalRes);
        return resArr;
    }

};