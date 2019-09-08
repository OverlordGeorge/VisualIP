let RRNode = require('./RRNode');

/*
класс отвечающий за временное хранилище
 */

module.exports = class RoundRobin{
    constructor(delta){
        this.delta = delta;
        this.nodes = [];
    }

    /*
    сделать такт
     */
    decreasePriorLevel(){
        for (let i =0; i<this.nodes.length;i++){
            this.nodes[i].prior--;
            if (this.nodes[i].prior===0){
                outAction(i);
            }
        }
    }

    /*
    убрать узел
     */

    outAction(num){
        let obj = this.nodes[num];
        this.nodes.splice(num,1);

    }

    /*
    добавить узел
     */

    inAction(data, time){
        for (let i=0;i<this.nodes.length;i++){
            let node = new RRNode(data, time);
            this.nodes.push(node);
        }
    }
};