var fs = require('fs');
var excel = require('excel');
var xlsx = require('node-xlsx');

var appendPropertie = function(name,value,obj){
    obj[name]=value;
}

ExcelReader.prototype.getStream = function(){
   /* excel(this.name, function(err, data) {
        if(err)
            throw err;
        else{
            /*for (var i=1;i<data.length;i++)
            {
                var obj = [];
                appendPropertie('ip',data[i][0],obj);
                appendPropertie('length',parseInt(data[i][1]),obj);
                appendPropertie('from',data[i][2],obj);
                appendPropertie('to',data[i][3],obj);
                appendPropertie('time',new Date(data[i][4]+" "+data[i][5]),obj);
                appendPropertie('helo',data[i][6],obj);
                appendPropertie('hostName',data[i][7],obj);
                appendPropertie('type',data[i][8],obj);
                console.log(obj);
                this.objects.push(obj);
                console.log(i);
            }

        }
    });*/
    var data = xlsx.parse(this.name);
    //console.log(data[0].data);
    console.log(data[0].data[2]);
    //var xlsxDate = '42430.32226851852'
    var unixTime=new Date(Math.round(data[0].data[2][5]/1157410)).getTime()/1000;
    console.log(unixTime)
};

function ExcelReader(name){
    this.name = name;
    this.objects=[];
    this.startTime;
    this.startPos;
    this.currPos;
    this.currentT;
    this.getStream();
}

ExcelReader.prototype.setStart = function(time){
   // for (var i = this.startPos;i<this.objects.length;i++){
        var ips=[];
        var date=new Date(this.objects[i].DATE+" "+this.objects[i].TIME);
        while ( (date<time) ||(this.startPos<this.objects.length) );
        {
            ips.push = this.object[this.startPos];
            date = new Date(this.objects[i].DATE+" "+this.objects[i].TIME);
            this.startPos++;
        }
        return ips;
}



ExcelReader.prototype.getPerTime=function(time){
    var i = this.startPos;
    while (i<this.objects.length)
    {
            //var currTime=new Date(this.objects[i].);

    }
};

var a = new ExcelReader('../../data/spamtest.xlsx');
var minutes = 5, the_interval = 2 * 1000;
setInterval(function() {
    console.log("I am doing my 5 minutes check");
    // do your stuff here
}, the_interval);
//module.exports.readFromExcel = ExcelReader;