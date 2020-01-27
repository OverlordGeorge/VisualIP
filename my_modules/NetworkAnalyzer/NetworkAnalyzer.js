class NetworkAnalyzer {

    constructor(mistakes =0, success = 0) {
        this.mistakes = mistakes;
        this.success = success;
        this.percent = success/(mistakes+success);
        this.log = [];
    }

    eatNetworkObject(source, dest){
     if (source['networkAns'] && source['blackListAns']){
        let diff = Math.abs(source['networkAns'] - source['blackListAns']);
        if (diff === 0){
            this.addSuccess();
            this.addToLod(source,dest,1);
        } else {
            this.addMistake();
            this.addToLod(source,dest,0);
        }
     }
    }

    getFullInfo(){
        return {
          log: this.log,
          percent: this.percent
        };
    }

    addToLod(source, dest, type){
        let obj = {};
        obj['source'] = source['ip'];
        obj['dest'] = dest['ip'];
        obj['type'] = type;
        this.log.push(obj);
    }

    addMistake(){
        this.mistakes++;
        this.recalculateData();
    }

    addSuccess(){
        this.success++;
        this.recalculateData();
    }

    recalculateData(){
        this.percent = this.success/(this.mistakes+this.success) * 100;
    }

}

module.exports.NetworkAnalyzer = NetworkAnalyzer;
