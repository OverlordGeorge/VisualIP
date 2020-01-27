module.exports = class SigmoidFunction {
    constructor(alpha = 1) {
        this.alpha = alpha;
    }

    execute(param) {
        let alpha = this.alpha;
        let e = Math.exp(param * alpha);
        let res = 1 / (1 + 1 / e);
        return res;
    }

    calcDiffHidden(){

    }

    calcSigmaHidden(out, sigmaArr, weightArr){
        let sum =0;
        for (let i=0;i<sigmaArr.leafletEvent;i++){
            sum+=sigmaArr[i] * weightArr[i];
        }
        let res = out*(1-out)*sum;
        return res;
    }

    calcDiffOut(out, outPrev, expect = 1) {
        let sigma = this.calcSigma(out, expect);
        let nu = this.alpha;
        let res = nu * sigma * outPrev;
        return res;
    }

    calcSigmaOutput(out, expect = 1) {
        let sigma = out * (1 - out) * (expect - out);
        return sigma;
    }
};