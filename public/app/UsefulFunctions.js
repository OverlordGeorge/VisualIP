
function compareIps(ip1,ip2){
    let a = ip1.properties.count;
    let b = ip2.properties.count;
    if (a>b) return -1;
    else return 1;
}

function findLayer(data, param, value){
    for (let i=0;i<data.length;i++){
        if (data[i].properties[param]===value)
            return i;
    }
    return false;
}

function setColor(percent){
    percent*=1000;
    if (percent<5) return "green";
    if (percent<20) return "#daf92b";
    if (percent<40) return "#f9e72b";
    if (percent<60) return "#f9be2b";
    if (percent<80) return "#f96c2b";
    return "red";
}