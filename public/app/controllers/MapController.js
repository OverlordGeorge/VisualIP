var countries;
var countries_bounds;

app.controller("MapController", function ($scope, socket, $http, $window) {

    let markerLifetime = 8000;
    let networkInfoRefreshTime = 5000;

    let ips = {};
    let paths = {};

    $scope.countryInfo = '';
    $scope.countryInfo;
    $scope.networkInfo = {
        log: [],
        percent: 1
    };
    let countryPopup;
    $scope.countryIps = [];
    $scope.shCountry = false;
    let allIps = [];
    let watchCountry = false;
    let layers = [];

    socket.emit('networkInfo');
    socket.on('getNewSignals', (data) => {
        let parsedData = JSON.parse(data);
        setMarker(parsedData.source);
        if (parsedData.dest && parsedData.dest !== false) {
            setDestination(parsedData.dest);
            setPath(parsedData.source, parsedData.dest);
        }
    });

    let setMarker = function (parsedData) {
        let newSource = new Source(parsedData);
        let uniqueValue = Math.round(Math.random()*1000000);
        let uniqueKey = "source" + uniqueValue;
        ips[uniqueKey] = newSource;
        setTimeout(() => {
            delete ips[uniqueKey];
            $scope.$digest();
        }, markerLifetime);
        $scope.$digest();
    };

    let setDestination = function (parsedData) {
        let newDestination = new Destination(parsedData);
        let uniqueValue = Math.round(Math.random()*1000000);
        let uniqueKey = "destination" + uniqueValue;
        ips[uniqueKey] = newDestination;
        setTimeout(() => {
            delete ips[uniqueKey];
            $scope.$digest();
        }, markerLifetime);
        $scope.$digest();
    };

    let setPath = function (source, destination) {
        //let newPath = new Path(source, destination);
        let uniqueValue = Math.round(Math.random()*1000000);
        let uniqueKey = "path" + uniqueValue;
        let counter = 100;
        let currStep = 1;
        let intervalTime = markerLifetime/counter;
        let intervalFunc = setInterval( ()=>{
            if (currStep === 100){
                paths[uniqueKey] = undefined;
                delete paths[uniqueKey];
                window.clearInterval(intervalFunc);
                $scope.$digest();
                return;
            }
            delete paths[uniqueKey];
            let tempPath = new Path(source, destination, currStep, counter);
            paths[uniqueKey] = tempPath;
            currStep++;
            $scope.$digest();
        }, intervalTime);
    };

    socket.on('getNetworkInfo',function(data){
        let parsedData= JSON.parse(data);
        parsedData.percent = Math.round(parsedData.percent );
        $scope.networkInfo = parsedData;
    });

    setInterval( () =>{
        socket.emit('networkInfo');
    }, networkInfoRefreshTime);

    /* socket.on('getIpStack',function(data){
         if (data && watchCountry!==true) {
            // ips = [];
             for (var i=0; i<ips.length; i++)
             {
                 delete ips[i];
             }
             ips.length = data.length;
             for (var i = 0; i < data.length; i++) {
                 var obj = new Source(data[i],"Threat");
                 ips[i]=obj;
             }
             $scope.$digest();
         }
     });*/

    $scope.getBotnet = function () {
        for (var i = 0; i < ips.length; i++) {
            delete ips[i];
        }
        let size = 0;
        for (let i = 0; i < allIps.length; i++)
            if (allIps[i].properties.count > 10)
                size++;
        ips.length = size;
        for (let i = 0; i < size; i++) {
            let obj = new Botnet(allIps[i]);
            ips[i] = obj;
        }
        watchCountry = true;
        //$scope.$digest();
    };

    socket.on('getCountryPercents', function (data) {
        let res = JSON.parse(data)
        for (let i = 0; i < layers.length; i++) {
            let num = findLayer(res, "alpha-3", layers[i].feature.id);
            if (num !== false && res[i].properties) {
                let color = setColor(res[num].properties.percent);
                layers[i].setStyle({
                    color: color,
                    fillColor: color,
                    opacity: 0.2,
                    fillOpacity: 0.2
                });
                layers[i].bringToFront();
            }
        }
    });

    socket.on('getCountryInfo', function (data) {
        $scope.shCountry = true;
        let result = JSON.parse(data);
        //console.log(result);
        allIps = [];
        $scope.countryIps = [];
        $scope.countryInfo = result.country.properties;
        //ips = [];
        for (let i = 0; i < result.ips.length; i++) {
            allIps.push(result.ips[i]);
        }
        allIps.sort(compareIps);
        for (let i = 0; i < 3; i++) {
            if (allIps[i])
                if (allIps[i].properties.count > 50) {
                    $scope.countryIps.push(allIps[i]);
                }
        }
        $scope.download();
        $scope.countryInfo = result.country;
    })

    $http.get('../../infoData/country_codes.json').then(function (data) {
        countries = data.data;
    });

    $http.get('../../infoData/countries_bounds1.json').then(function (data) {
        $scope.geojson = {
            data: data.data,
            style: {
                color: "white",
                fillColor: "white",
                opacity: 0.2,
                fillOpacity: 0.2
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.id, {}).on('popupopen', function () {
                    let code = feature.id;
                    socket.emit('countryInfo', code);
                });
                layer.on('mouseover', function () {
                    layer.setStyle({
                        weight: 4,
                        opacity: 1,
                        fillOpacity: 0.2
                    });
                    layer.bringToFront();
                })
                layer.on('mouseout', function () {
                    layer.setStyle({
                        //color: "white",
                        //fillColor: "white",
                        opacity: 0.2,
                        fillOpacity: 0.2
                    });
                    layer.bringToFront();
                })
                layers.push(layer);
            }
        };
    });

    $scope.download = function () {
        let botnet = [];
        for (let i = 0; i < allIps.length; i++)
            if (allIps[i].properties.count > 50)
                botnet.push(allIps[i]);
        //console.log(botnet);
        $scope.refreshFile(allIps[0].properties.country, botnet);
    };

    $scope.refreshFile = function (country, countryIps) {
        $scope.fileName = country + ".json";
        //console.log(countryIps);
        data = {
            name: country,
            source: "users",
            ips: []
        };
        for (let i = 0; i < countryIps.length; i++) {
            data.ips.push(countryIps[i].properties.ip);
        }
        data = JSON.stringify(data);
        blob = new Blob([data], {type: 'text/plain'});
        $scope.fileUrl = url.createObjectURL(blob);
    };

    let data, blob, url;

    $scope.fileName = "country.json";
    data = "test";
    blob = new Blob([data], {type: 'text/plain'});
    url = $window.URL || $window.webkitURL;
    $scope.fileUrl = url.createObjectURL(blob);

    $scope.countryClose = function () {
        watchCountry = false;
        $scope.shCountry = false;
    };

    angular.extend($scope, {
        defaults: {
            tileLayer: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
        },
        center: {
            lat: 48,
            lng: 4,
            zoom: 3
        },
        markers: ips,
        paths: paths,
        geojson: {}
    });

});