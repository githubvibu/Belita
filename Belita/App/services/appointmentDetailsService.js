app.factory('appointmentDetailsService', appointmentDetailsService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function appointmentDetailsService($http, $rootScope, $location, app) {
    var apiUrlAppointmentDetails = app.serviceBaseURL + "/appointment/details";

    var services = {};
   
    services.GetAppointment = GetAppointment;
    return services;

    function GetAppointment(appid) {
        
        return $http.get(apiUrlAppointmentDetails + "?appid=" + appid)
        .success(function (response) {
            return response;
        });
    }
}