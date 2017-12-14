
var countries;

app.controller("MapController", function($scope, socket, $http) {

    var fx = new L.PosAnimation();
    var ips =[];

    socket.on('getIpStack',function(data){
        if (data) {
           // ips = [];
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                var obj = new Source(data[i],"Threat");
                ips.push(obj);
            }
            $scope.$digest();
        }
    });

    $http.get('../../infoData/countries.json').then(function(data) {
        countries = data.data;
    });

    angular.extend($scope,{
        defaults: {
            tileLayer: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            // tileLayerOptions: {
            //     opacity: 0.9,
            //     detectRetina: true,
            //     reuseTiles: true,
            // },
           // scrollWheelZoom: false

        },
        center: {
            lat: 48,
            lng: 4,
            zoom: 3
        },
        markers: ips
    })

    });