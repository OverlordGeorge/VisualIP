class SigmoidFunction{
    constructor(alpha = 1){
        this.alpha = alpha;
    }

    execute(param){
        let alpha = this.alpha;
        let e = Math.exp(param * alpha);
        let res = 1/(1+1/e);
        return res;
    }
}

module.exports.SigmoidFunction = SigmoidFunction;