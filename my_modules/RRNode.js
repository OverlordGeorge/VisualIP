/*
класс узел, предназначенный для хранения набора адресов
 */

module.exports = class RRNode{

    /*
    конструктор, вызывается при создании нового узла
     */

  constructor(ips,time = Math.floor(new Date() / 1000)){
      this.ips=ips;
      this.firstTime = time;
      this.lastTime = time;
      this.prior = 1;
  }

  /*
  проверка на принадлежность набора адресов к узлы
   */

  checkIfMine(ips, time){
    for (let i=0;i<ips.length;i++)
    {
        for (let j=0;j<this.ips.length;j++)
            if (ips[i]===this.ips[j]){
                this.addData(ips,time);
                return true;
            }
    }
    return false;
  }

  /*
  проверка на уникальность адреса
   */
  checkIfUnique(ip){
      for (let i=0;i<this.ips.length;i++){
          if (ip===this.ips[i])
              return;
      }
      this.ips.push(ip);
  }

  /*
  добавление данных в узел
   */

  addData(ips,time){
      for (let i=0;i<ips.length;i++)
          this.checkIfUnique(ips[i]);
      this.lastTime = time;
      this.prior++;
  }


};