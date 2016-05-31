app.factory('schedulerService', schedulerService);
app.$inject = ['$http', '$rootScope', '$location', 'app', '$q'];

function schedulerService($http, $rootScope, $location, app, $q) {

    var apiUrlCustomerDetail = app.serviceBaseURL + "/activity/getdetailajax";
    var apiUrlGetServices = app.serviceBaseURL + "product/list/by/cityandcategoryid";
    var apiUrlGetCustomerAppointments = app.serviceBaseURL + "activity/getcustomerappointments";
    var spiUrlGetStylistByBasecenter = app.serviceBaseURL + "stylist/list/by/baseServiceCenterId";
    var apiUrlGetAppointmentList = app.serviceBaseURL + "appointment/list/basecenterAndDate";
    var apiUrlAddAppointmnet = app.serviceBaseURL + "appointment/cro/add";
    var apiUrlAddCustomer = app.serviceBaseURL + "customer/cro/add";
    var apiUrlUpdateAppointmnet = app.serviceBaseURL + "appointment/cro/update";
    var apiUrlUpdateCustomer = app.serviceBaseURL + "customer/cro/update";
    var apiUrlGetAppointmentByAppId = app.serviceBaseURL + "appointment/details";
    var apiUrlStylistWithAttendence = app.serviceBaseURL + "stylist/list/WithScheduleInfo";
    var apiUrlDiscountApply = app.serviceBaseURL + "discount/cro/apply";
    var apiUrlIsPremiumTime = app.serviceBaseURL + "premium/ispremium";
    var apiUrlAppointmentStatusUpdate = app.serviceBaseURL + "appointment/update/status";
    var apiUrlAddFeedBack = app.serviceBaseURL + "appointmentfeedback/add";
    var apiUrlSavePettyCash = app.serviceBaseURL + "petty/create";
    var apiUrlGetPettyCash = app.serviceBaseURL + "petty/get/approved";
    var apiUrlGetPettyCashUnApproved = app.serviceBaseURL + "petty/get/nonapproved";
    var apiUrlApprovePettyCash = app.serviceBaseURL + "petty/approve";
    var apiUrlSendInvoice = app.serviceBaseURL + "appointment/send/invoice";
    var apiUrlGetBelitaMoney = app.serviceBaseURL + "activity/getbelitamoneydetails";
    var apiUrlCancelAppointment = app.serviceBaseURL + "appointment/update/status";
    var apiUrlStylistCheckin = app.serviceBaseURL + "stylist/addcheckincheckout";
    var apiUrlStylistAlocationStatus = app.serviceBaseURL + "stylist/validate/stylist";

    var service = {}
    service.GetCustomerDetail = GetCustomerDetail;
    service.GetServiceByCategoryAndCityId = GetServiceByCategoryAndCityId;
    service.GetCustomerAppointments = GetCustomerAppointments;
    service.GetStylistList = GetStylistList;
    service.GetAppoiontmentByDateAndBasecenter = GetAppoiontmentByDateAndBasecenter;
    service.AddAppointment = AddAppointment;
    service.AddCustomer = AddCustomer;
    service.GetAppointmentByAppId = GetAppointmentByAppId;
    service.UpdateCustomer = UpdateCustomer;
    service.UpdateAppointment = UpdateAppointment;
    service.GetStylistDetailWithAttendence = GetStylistDetailWithAttendence;
    service.applyDiscount = applyDiscount;
    service.IsPremiumTime = IsPremiumTime;
    service.UpdateAppointmentStatus = UpdateAppointmentStatus;
    service.AddFeedBack = AddFeedBack;
    service.SavePettyCash = SavePettyCash;
    service.GetPettyCash = GetPettyCash;
    service.GetPettyCashUnApproved = GetPettyCashUnApproved;
    service.ApprovePettyCash = ApprovePettyCash;
    service.SendInvoice = SendInvoice;
    service.GetBelitaMoney = GetBelitaMoney;
    service.CancelAppointment = CancelAppointment;
    service.StylistCheckin = StylistCheckin;
    service.StylistAllocationStatus = StylistAllocationStatus;
    return service;

    function applyDiscount(model) {
        return $http.post(apiUrlDiscountApply, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetCustomerDetail(customerMobno) {

        return $http.get(apiUrlCustomerDetail + "?mob=" + customerMobno)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetServiceByCategoryAndCityId(cityId, categoryId) {

        return $http.get(apiUrlGetServices + "?cityId=" + cityId + "&productCategoryIds=" + categoryId + "&pageNo=&size=")
    .success(function (response) {
        return response;
    });

    }


    function GetCustomerAppointments(customerId) {
        return $http.get(apiUrlGetCustomerAppointments + "?custId=" + customerId)
        .success(function (response) {
            return response;
        });
    }

    function GetStylistList(baseCenterId) {
        return $http.get(spiUrlGetStylistByBasecenter + "?baseServiceCenterId=" + baseCenterId)
           .success(function (response) {
               return response;
           });
    }

    function GetAppoiontmentByDateAndBasecenter(basecenterId, cityId, date) {
        return $http.get(apiUrlGetAppointmentList + "?baseCenterId=" + basecenterId + "&cityId=" + cityId + "&appointmentDate=" + date)
        .success(function (response) {
        });
    }

    function GetStylistDetailWithAttendence(baseCenterId, cityId, date) {

        return $http.get(apiUrlStylistWithAttendence + "?baseServiceCenterId=" + baseCenterId + "&cityId=" + cityId + "&date=" + date)
           .success(function (response) {
               return response;
           });
    }

    function AddAppointment(model) {

        return $http.post(apiUrlAddAppointmnet, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function AddCustomer(model) {
        return $http.post(apiUrlAddCustomer, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function GetAppointmentByAppId(appId) {
        return $http.get(apiUrlGetAppointmentByAppId + "?appid=" + appId)
        .success(function (response) {
            return response;
        });
    }

    function UpdateAppointment(model) {

        return $http.post(apiUrlUpdateAppointmnet, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function UpdateCustomer(model) {

        return $http.post(apiUrlUpdateCustomer, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function IsPremiumTime(time) {
        return $http.get(apiUrlIsPremiumTime + "?startTime=" + time)
        .success(function (response) {
            return response;
        });
    }

    function UpdateAppointmentStatus(appId, appStatus) {
        return $http.post(apiUrlAppointmentStatusUpdate + "?appId=" + appId + "&appStatus=" + appStatus)
        .success(function (response) {
            return response;
        });
    }

    function AddFeedBack(model) {
        return $http.post(apiUrlAddFeedBack, JSON.stringify(model))
        .success(function (result) {
            return result;
        });
    }

    function SavePettyCash(model) {
        return $http.post(apiUrlSavePettyCash, JSON.stringify(model))
        .success(function (result) {
            return result;
        });
    }

    function GetPettyCash(basecenterId, date) {
        return $http.get(apiUrlGetPettyCash + "?baseCenter=" + basecenterId + "&date=" + date)
        .success(function (result) {
            return result;
        });
    }

    function GetPettyCashUnApproved(basecenterId, date) {
        return $http.get(apiUrlGetPettyCashUnApproved + "?baseCenter=" + basecenterId + "&date=" + date)
        .success(function (result) {
            return result;
        });
    }

    function ApprovePettyCash(id) {
        return $http.post(apiUrlApprovePettyCash + "?pcashId=" + id)
        .success(function (result) {
            return result;
        });
    }

    function SendInvoice(appId) {
        return $http.get(apiUrlSendInvoice + "?appId=" + appId)
        .success(function (result) {
            return result;
        });
    }

    function GetBelitaMoney(customerId) {
        return $http.get(apiUrlGetBelitaMoney + "?custId=" + customerId)
        .success(function (result) {
            return result;
        });
    }

    function CancelAppointment(appointmentId, appStatus, feedback, send_notification) {
        return $http.post(apiUrlCancelAppointment + "?appId=" + appointmentId + "&appStatus=" + appStatus + "&reason=" + feedback + "&send_notification=" + send_notification)
       .success(function (result) {
           return result;
       });
    }

    function StylistCheckin(model) {
        return $http.post(apiUrlStylistCheckin, JSON.stringify(model))
        .success(function (result) {
            return result;
        });
    }

    function StylistAllocationStatus(model) {
        var deferred = $q.defer();
        $http.post(apiUrlStylistAlocationStatus,JSON.stringify(model))
        .success(function (result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }

}