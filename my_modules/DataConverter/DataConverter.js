class DataConverter {

    constructor(){

    }

    /*
    192.168.0.1 ->  192(256)^3 + 168(256)^2 + 0(256)^1 + 1 = 3232235521
     */
    ipToDecimal(ip){
        let nums = ip.split('.');
        nums.forEach((val, i, arr)=>{
           arr[i] = parseInt(val, 10);
        });
        let res = 0;
        for (let i=0;i<nums.length;i++){
            res+= Math.pow(256, i)*nums[nums.length-1-i];
        }
        return res;
    }

    checkIfValid(field){
        if (!field) {
            return false;
        }
        if (field === "" || field ==='null' || field === null) {
            return false
        }
        return true;
    }
    
    utcToUnix(time){
        if (this.checkIfValid(time)) {
            return false
        }
        time = time.replace(':',' ');
        time = time.replace('/',' ');
        time = time.replace('/',' ');
        time = time.replace('/',' ');
        return new Date(time).getTime()/1000;
    }
    
    strToDecimal(str){
        let res = parseInt(str);
        if (isNaN(res)){
            return false;
        }
        else {
            return res;
        }
    }

    logarithm(value){
        if (this.checkIfValid(value)) {
            return false
        }
        value = parseInt(value);
        return Math.round(Math.log(value));
    }

}

module.exports.DataConverter = DataConverter;
