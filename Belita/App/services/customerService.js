app.factory('customerService', customerService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function customerService($http, $rootScope, $location, app) {
    var apiUrl = app.serviceBaseURL + "customer/cro/add";
    var apiUrlCustomerList = app.serviceBaseURL + "activity/getdetailajax";
    var apiUrlCustomerById = app.serviceBaseURL + "activity/getdetails";
    var apiUrlCustomerUpdate = app.serviceBaseURL + "customer/cro/update";

    var apiUrlAppointmentHistory = app.serviceBaseURL + "cro/customerdetailhistory";
    var apiUrlPaymentHistory = app.serviceBaseURL + "cro/customerdetailhistory";
    var apiUrlNotificationHistory = app.serviceBaseURL + "notification/details";
    var apiUrlSubscribedPackages = app.serviceBaseURL + "cro/customerdetailhistory";
    var apiUrlBelitaMoney = app.serviceBaseURL + "activity/getbelitamoneydetails";
    var apiUrlUpdateBelitaMoney = app.serviceBaseURL + "/activity/cro/updatebm";
    var apiUrlGetBelitaMoneyTransaction = app.serviceBaseURL + "appointment/get/bmtxn";
    var apiUrlGetBirthdayAnniversary = app.serviceBaseURL + "customer/getAnnvAndBirthDateDetails";

    var services = {};
    services.CreateCustomer = CreateCustomer;
    services.GetCustomerList = GetCustomerList;
    services.GetCustomerById = GetCustomerById;
    services.UpdateCustomer = UpdateCustomer;

    services.GetAppointmentHistory = GetAppointmentHistory;
    services.GetNotificationHistory = GetNotificationHistory;
    services.GetPaymentHistory = GetPaymentHistory;
    services.GetSubscribedPackages = GetSubscribedPackages;
    services.GetBelitaMoney = GetBelitaMoney;
    services.UpdateBelitaMoney = UpdateBelitaMoney;
    services.GetBelitaMoneyTransaction = GetBelitaMoneyTransaction;
    services.GetBirthdayAnniversary = GetBirthdayAnniversary;
    return services;

    function CreateCustomer(model) {
        return $http.post(apiUrl, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function GetCustomerList(mob) {
        return $http.get(apiUrlCustomerList + "?mob=" + mob)
        .success(function (response) {
            return response;
        });
    }

    function GetCustomerById(customerId) {
        return $http.get(apiUrlCustomerById + "?custId=" + customerId)
        .success(function (response) {
            return response;
        });
    }

    function UpdateCustomer(model) {
        return $http.post(apiUrlCustomerUpdate, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function GetAppointmentHistory(id) {
        return $http.get(apiUrlAppointmentHistory + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }

    function GetNotificationHistory(id) {
        
        return $http.get(apiUrlNotificationHistory + "?custId=" + id)
        .success(function (response) {
            return response;
        });
    }

    function GetPaymentHistory(id) {
        return $http.get(apiUrlPaymentHistory + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }

    function GetSubscribedPackages(id) {
        return $http.get(apiUrlSubscribedPackages + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }

    function GetBelitaMoney(id) {
        return $http.get(apiUrlBelitaMoney + "?custId=" + id)
        .success(function (response) {
            return response;
        });
    }

    function UpdateBelitaMoney(model) {
        return $http.post(apiUrlUpdateBelitaMoney + "?custId=" + model.custId + "&bmType=" + model.bmType + "&amount=" + model.amount + "&expiry=" + model.expiry)
        .success(function (response) {
            return response;
        });
    }

    function GetBelitaMoneyTransaction(customerId)
    {
        return $http.get(apiUrlGetBelitaMoneyTransaction + "?custId=" + customerId)
        .success(function (response) {
            return response;
        });
    }

    function GetBirthdayAnniversary(fromDate,toDate)
    {
        return $http.get(apiUrlGetBirthdayAnniversary + "?start_time=" + fromDate + "&end_time=" + toDate)
        .success(function (response) {
            return response;
        });
    }
}