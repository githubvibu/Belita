app.factory('basecenterService', basecenterService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function basecenterService($http, $rootScope, $location, app) {

    var apiUrlAddBasecenter = app.serviceBaseURL + "basecenter/add";

    var service = {};
    service.AddBasecenter = AddBasecenter;
    return service;


    function AddBasecenter(model) {
        return $http.post(apiUrlAddBasecenter, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }
}