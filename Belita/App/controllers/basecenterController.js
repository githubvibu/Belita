app.controller('basecenterController', basecenter);
app.$inject = ['$scope', '$routeParams', '$location', 'app', 'commonService', '$timeout', 'basecenterService'];
function basecenter($scope, $routeParams, $location, app, commonService, $timeout, basecenterService) {
    $scope.basecenter = "";
    $scope.cityId = "";
    $scope.city = [];

    $scope.loadForm = function () {
        $scope.city = commonService.GetMasterCities();
    };

    $scope.CreateBasecenter = function () {
        $("#dvAddBasecenter").modal("show");
    };

    $scope.GetBasecenterData = function () {

    };

    $scope.Addbasecenter = function () {
        var myDataPromise = basecenterService.AddBasecenter($scope.GetBasecenterModel());
        myDataPromise.then(function (result) {
            
        });
    };

    $scope.GetBasecenterModel = function () {
        var model = {
            id: 0,
            serviceCityID: $scope.cityId,
            name: $scope.basecenter
        };
        return model;
    };
}