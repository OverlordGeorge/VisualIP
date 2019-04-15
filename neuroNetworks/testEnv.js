
let Network = require('./simpleSigmoid/Network');

let net = new Network(2, 1, 1);
net.prepareNetwork(3);
console.log(net);
let possErr = 0.01;
console.log("start teaching: ");
/*for (let i = 0; i<1000; i++){
    let res = net.executeNetwork([0, 0]);
    let expectArray = [1,0];
}*/

let res = net.executeNetwork([0.5, 0.5]);
console.log(res[0]);
