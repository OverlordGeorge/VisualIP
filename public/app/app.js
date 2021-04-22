var app = angular.module("MainApp", ['ui-leaflet','zingchart-angularjs']);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);