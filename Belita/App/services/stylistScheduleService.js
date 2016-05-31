app.factory('stylistScheduleService', stylistScheduleService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function stylistScheduleService($http, $rootScope, $location, app) {
    var apiUrlCustomerDetail = app.serviceBaseURL + "stylist/attendance/add";
    var service = {}
    service.addStylistSchedule = addStylistSchedule;
    return service;

    function addStylistSchedule(model)
    {
        return $http.post(apiUrlCustomerDetail, JSON.stringify(model))
        .success(function (result) {
            return result;
        });
    }
}