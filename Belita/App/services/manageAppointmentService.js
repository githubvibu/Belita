app.factory('manageAppointmentService', manageAppointment);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function manageAppointment($http, $rootScope, $location, app) {
    var appUrlGetAppointment = app.serviceBaseURL + "appointment/list/cityId";
    var spiUrlGetStylistByBasecenter = app.serviceBaseURL + "stylist/list/by/baseServiceCenterId";///
    var appUrlGetAppointmentById = app.serviceBaseURL + "appointment/details";
    //var appUrlUpdateAppointment = app.serviceBaseURL + "appointment/cro/update";
    var appUrlUpdateAppointment = app.serviceBaseURL + "appointment/cro/assignStylist";
    var apiUrlStylistWithAttendence = app.serviceBaseURL + "stylist/list/WithScheduleInfo";
    var apiUrlStylistLocation = app.serviceBaseURL + "stylist/allocation/status";
    var services = {};
    services.GetAppointmentList = GetAppointmentList;
    services.GetStylistList = GetStylistList;
    services.GetAppointmentById = GetAppointmentById;
    services.UpdateAppointment = UpdateAppointment;
    services.GetStylistDetailWithAttendence = GetStylistDetailWithAttendence;
    services.GetStylistLocations = GetStylistLocations;
    return services;

    function GetAppointmentList(cityId) {
        return $http.get(appUrlGetAppointment + "?cityId=" + cityId)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetStylistDetailWithAttendence(baseServiceCenterId,cityId, date) {
        return $http.get(apiUrlStylistWithAttendence + "?baseServiceCenterId=" + baseServiceCenterId + "&cityId=" + cityId + "&date=" + date)
       .success(function (response) {
           return response.result_set;
       });
    }

    function GetStylistList(baseCenterId) {
        return $http.get(spiUrlGetStylistByBasecenter + "?baseServiceCenterId=" + baseCenterId)
           .success(function (response) {
               return response;
           });
    }

    function GetAppointmentById(id)
    {
        return $http.get(appUrlGetAppointmentById + "?appid="+id)
        .success(function (response) {
            return response;
        });
    }

    function UpdateAppointment(model)
    {
        return $http.post(appUrlUpdateAppointment, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function GetStylistLocations(baseCenterId,date)
    {
        return $http.get(apiUrlStylistLocation + "?baseServiceCenterId=" + baseCenterId + "&app_time=" + date)
        .success(function (response) {
            return response;
        });
    }
}
