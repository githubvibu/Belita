app.factory('reportService', reportService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function reportService($http, $rootScope, $location, app) {
    var apiUrlReportGet = app.serviceBaseURL + "report/get/appdetails";
    var apiUrlSalesReport = app.serviceBaseURL + "report/get/basecenteranddate";
    var apiUrlFeedBackReport = app.serviceBaseURL + "report/feedback/basecenteranddate";
    var apiUrlPettyCashReport = app.serviceBaseURL + "report/pettycash/basecenteranddate";
    var apiUrlRevenueReportByService = app.serviceBaseURL + "report/revenue/service";
    var apiUrlStylistAttendence = app.serviceBaseURL + "/report/therapist/attendence";
    var apiUrlMembershipReportGet = app.serviceBaseURL + "/report/membership";
    var service = {};
    service.GetReportByDate = GetReportByDate;
    service.GetSalesReport = GetSalesReport;
    service.GetFeedBackReport = GetFeedBackReport;
    service.GetPettyCashReport = GetPettyCashReport;
    service.GetRevenueReportByService = GetRevenueReportByService;
    service.GetStylistAttendenceReport = GetStylistAttendenceReport;
    service.GetMembershipReport = GetMembershipReport;
    return service;

    function GetReportByDate(date, basecenterId,cityId) {
        return $http.get(apiUrlReportGet + "?appointmentDate=" + date + "&baseCenterId=" + basecenterId + "&cityId=" + cityId)
        .success(function (result) {
            return result;
        });
    }

    function GetSalesReport(fromDate, toDate, baseCenterId,cityId) {
        return $http.get(apiUrlSalesReport + "?fromdate=" + fromDate + "&todate=" + toDate + "&baseCenterId=" + baseCenterId + "&cityId=" + cityId)
        .success(function (result) {
            return result;
        });
    }

    function GetFeedBackReport(fromDate, toDate, baseCenterId, cityId) {
        return $http.get(apiUrlFeedBackReport + "?fromdate=" + fromDate + "&todate=" + toDate + "&baseCenterId=" + baseCenterId + "&cityid=" + cityId)
        .success(function (result) {
            return result;
        });
    }

    function GetPettyCashReport(fromDate, toDate, baseCenterId) {
        return $http.get(apiUrlPettyCashReport + "?fromdate=" + fromDate + "&todate=" + toDate + "&baseCenterId=" + baseCenterId)
        .success(function (result) {
            return result;
        });
    }

    function GetRevenueReportByService(fromDate, toDate, baseCenterId, cityId)
    {
        return $http.get(apiUrlRevenueReportByService + "?fromdate=" + fromDate + "&todate=" + toDate + "&baseCenterId=" + baseCenterId + "&cityid=" + cityId)
        .success(function (result) {
            return result;
        });
    }

    function GetStylistAttendenceReport(fromDate, toDate, baseCenterId, cityId)
    {
        return $http.get(apiUrlStylistAttendence + "?fromdate=" + fromDate + "&todate=" + toDate + "&basecenter=" + baseCenterId + "&cityid=" + cityId)
       .success(function (result) {
           return result;
       });
    }

    function GetMembershipReport(fromDate,toDate){
        return $http.get(apiUrlMembershipReportGet + "?fromdate=" + fromDate + "&todate=" + toDate)
        .success(function (result) {
            return result;
        });
    }
}