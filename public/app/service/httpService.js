app.factory('httpService',function($http){
    return {
        getCountryInfo: function(name, callback) {
            $http({
                method: "GET",
                url: "/getCountryInfo?name="+name,
            }).then(function (data) {
                callback(data.data);
            }, function (data) {
                alert(data.data);
            })
        }
    }
});
