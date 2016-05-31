app.factory('crouserService', crouserService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function crouserService($http, $rootScope, $location, app) {

    var apiUrlCroUserAdd = app.serviceBaseURL + "cro/insertUserDetails";
    var apiUrlCroUserGetList = app.serviceBaseURL + "cro/getUserDetails";
    var apiUrlCroUserGetById = app.serviceBaseURL + "cro/getDetails/croId";
    var apiUrlCroUserUpdatePassword = app.serviceBaseURL + "cro/updatePassword";
    var service = {}
    service.AddCroUser = AddCroUser;
    service.GetCroUserList = GetCroUserList;
    service.GetCroUserById = GetCroUserById;
    service.CroUserUpdatePassword = CroUserUpdatePassword;
    return service;

    function AddCroUser(model) {
        return $http.post(apiUrlCroUserAdd, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetCroUserList() {
        return $http.get(apiUrlCroUserGetList)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetCroUserById(id) {
        return $http.post(apiUrlCroUserGetById + "?id=" + id)
        .success(function (response) {
            return response.result_set;
        });
    }

    function CroUserUpdatePassword(model) {
        //return $http.post(apiUrlCroUserAdd, JSON.stringify(model))
        //.success(function (response) {
        //    return response.result_set;
        //});
    }
}