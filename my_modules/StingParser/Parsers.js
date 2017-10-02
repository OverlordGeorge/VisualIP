var DeleteStrSpaces=function(str){
    var stpos = 0;
    var finpos= str.length;
    for (var i=0;i<str.length;i++){
        if ((str[i]!=' '))
        {
            stpos = i;
            break;
        }
    }
    for (var i=str.length-1;i>=stpos;i--){
        if ((str[i]!=' '))
            {
                finpos = i;
                break;
            }
    }
    return str.slice(stpos,finpos+1);
}

var FindField=function(text,str){
    var res = '';
    var finpos =0;
    var pos = text.indexOf(str,finpos);
    while (pos!=-1){
        if (res!='') res+=', ';
        finpos = text.indexOf('\n',pos);
        var line = text.substring(pos+str.length,finpos);
        res+=DeleteStrSpaces(line);
        pos = text.indexOf(str,finpos);
        if (pos>finpos+2) break;
    }
    return res;
}

var TextCleaner= function(text){
    var res = text;
    var stpos = res.indexOf('%');
    while (stpos!=-1){
        var finpos = res.indexOf('\n');
        res = res.slice(finpos+1,res.length);
        stpos = res.indexOf('%');
    }
    return res;
}

module.exports.TextCleaner = TextCleaner;
module.exports.FindField = FindField;