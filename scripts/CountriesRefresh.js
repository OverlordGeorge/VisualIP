var fs = require('fs');
var path = './data/CountryBorders/countries.geojson';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/local";

function findCountry(param, countries){
    for (var i=0;i<countries.length;i++){
        if (param==countries[i]['alpha-3'])
            return countries[i];
    }
    return false;
}

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("VisualIP");
    console.log("connected to DB");
    dbo.collection("Countries").deleteMany();
    fs.readFile('./data/countryFullInfo.json','utf8', function(err, coun) {
        if (err){
            console.log("error with file");
        }
        var countries = JSON.parse(coun);
        fs.readFile(path, 'utf8', function (err, data) {
            var res = JSON.parse(data);
            for (var i = 0; i < res.features.length; i++) {
                var obj = res.features[i];
                obj.properties['name'] = obj.properties['ADMIN'];
                obj.properties['alpha-3'] = obj.properties['ISO_A3'];
                delete obj.properties['ADMIN'];
                delete obj.properties['ISO_A3'];
                var country = findCountry(obj.properties['alpha-3'],countries);
                obj.properties['alpha-2']=country['alpha-2'];
                obj.properties['region']=country['region'];
                obj.properties['count']=0;
                dbo.collection("Countries").insertOne(obj, function (err, res) {
                    if (err) console.log(err);
                });
            }
            console.log("done");
            db.close();
        });
    })

});
