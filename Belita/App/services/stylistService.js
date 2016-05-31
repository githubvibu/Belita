app.factory('stylistService', stylistService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function stylistService($http, $rootScope, $location, app) {
    var appUrlStylistSkill = app.serviceBaseURL + "product/category/list";
    var apiUrlAdd = app.serviceBaseURL + "stylist/add";
    var apiUrlUpdate = app.serviceBaseURL + "stylist/update";
    var apiUrlStylistList = app.serviceBaseURL + "stylist/list/by/baseServiceCenterId";
    var apiUrlDelete = app.serviceBaseURL + "stylist/delete";
    var apiUrlStylistWithAttendence = app.serviceBaseURL + "stylist/list/WithScheduleInfo";
    var apiUrlStylistHistory = app.serviceBaseURL + "stylist/gethistory";
    

    var services = {};
    services.GetStylistDetail = GetStylistDetail;
    services.AddStylist = AddStylist;
    services.UpdateStylist = UpdateStylist;
    services.GetStylistById = GetStylistById;
    services.DeleteStylistById = DeleteStylistById;
    services.GetStylistSkill = GetStylistSkill;
    services.GetStylistHistory = GetStylistHistory;
    
    return services;

    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


    function GetStylistDetail(baseServiceCenterId) {

        return $http.get(apiUrlStylistList + "?baseServiceCenterId=" + baseServiceCenterId)
       .success(function (response) {

           return response.result_set;
       });
    }

    function GetStylistDetailWithAttendence(baseServiceCenterId, date) {

        return $http.get(apiUrlStylistList + "?baseServiceCenterId=" + baseServiceCenterId + "&date=" + date)
       .success(function (response) {
           return response.result_set;
       });
    }

    function AddStylist(model) {
        
        if (model.id == 0) {
            return $http.post(apiUrlAdd, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
        }
        else {
            return $http.post(apiUrlUpdate, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
        }


    }
    function UpdateStylist(model) {
        //TODO: pass this model into real web api
        $http.post(apiUrlUpdate, JSON.stringify(model))
        .success(function (response) {
            return response;
        });

    }

    function GetStylistById(id) {
        //var responsedata;
        //TODO: get data from real api
        return $http.post(apiUrlStylistList + "?baseServiceCenterId=" + baseServiceCenterId)
        .success(function (response) {
            return response;
        });
        //return responsedata;
    }

    function DeleteStylistById(id) {
        //TODO: call the delete api
        return $http.get(apiUrlDelete + "?stylistId=" + id)
        .success(function (response) {
            return response;
        });
    }


    function GetStylistSkill() {
        return $http.get(appUrlStylistSkill)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetStylistHistory(id) {
        return $http.get(apiUrlStylistHistory + "?stylistId=" + id)
        .success(function (response) {
            return response.result_set;
        });
    }
}