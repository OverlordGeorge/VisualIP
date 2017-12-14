var fs = require('fs');
var xlsx = require('xlsx');

ExcelReader.prototype.getStream = function(){
    var workbook = xlsx.readFile(this.name);
    var sheet_name_list = workbook.SheetNames;
    var data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    for (var i=0;i<data.length/2;i++){
        var obj={};
        obj['ip'] = data[i].IP;
        if (data[i].LENGTH)
            obj['length'] = data[i].LENGTH;
        obj['from']  = data[i].FROM;
        obj['to'] = data[i].TO;
        obj['time'] = new Date(data[i].DATE+" "+data[i].TIME).getTime()/1000;
        obj['host'] = data[i].HOSTNAME;
        obj['whymark'] = data[i].WHYMARK;
        this.objects.push(obj);
    }
    this.startPos=0;
    this.startTime=this.objects[0].time;
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
};

ExcelReader.prototype.restartReading=function(){
    this.startPos = 0;
    this.startTime=this.objects[0].time;
}

ExcelReader.prototype.getPerTime=function(time){
    var i = this.startPos;
    this.startTime = this.startTime + time;
    var res = [];
    while (i<this.objects.length)
    {
        if (this.objects[i].time>this.startTime) break;
        res.push(this.objects[i]);
        i++
    }
    this.startPos = i;
    if (i>this.objects.length) {
        this.restartReading();
    }
    return res;
};


//test for 3 seconds
/*
var excel = new ExcelReader('../../data/spamtest.xlsx');
var seconds = 5, the_interval = 2 * 1000;
setInterval(function() {
    var res = excel.getPerTime(seconds);
    console.log(res);
}, the_interval);
*/
module.exports.ExcelReader = ExcelReader;