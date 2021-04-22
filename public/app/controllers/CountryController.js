app.controller("CountryController", function ($scope, httpService) {

    $scope.$on('newCountry', function (event, id) {
        $scope.setCountryInfo(id);
    });

    $scope.countryInfo = false;
    $scope.countryStatistics = false;

    $scope.setCountryInfo = function(code) {
        $scope.countryStatistics = false;
        if (countries){
            let countryInfo = countries.find((country)=> country['alpha-3']===code);
            $scope.countryInfo = countryInfo;
            httpService.getCountryInfo(countryInfo['alpha-2'], (data)=>{
                $scope.countryStatistics = data;
                $scope.botsStats.series[0].values = [data.total - data.bots];
                $scope.botsStats.series[1].values = [data.bots];
                $scope.infectedStats.series[0].values = [data.total - data.infected];
                $scope.infectedStats.series[1].values = [data.infected];
            })
        }
    }

    $scope.infectedStats = {
        type: "pie",
        plot: {
            slice: 65
        },
        title: {
            textAlign: 'center',
            text: "infected"
        },
        series : [{
            values: [0],
            text: "Total Commits"
        }, {
            values: [0],
            text: "Issues Solved"

        }]
    }

    $scope.botsStats =  {
        type: "pie",
        plot: {
            slice: 65
        },
        title: {
            textAlign: 'center',
            text: "bots"
        },
        series : [{
            values: [0],
            text: "Total Commits"
        }, {
            values: [0],
            text: "Issues Solved"

        }]
    }

});
