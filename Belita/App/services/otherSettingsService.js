app.factory('otherSettingsService', otherSettings);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function otherSettings($http, $rootScope, $location, app) {
    var apiUrlRegister = app.serviceBaseURL + "masterdata/update/register/activity";
    var apiUrlReferrer = app.serviceBaseURL + "/masterdata/update/referrel/activity";
    var apiUrlAppVersion = app.serviceBaseURL + "/appversion/create";
    var apiUrlAppVersionDetails = app.serviceBaseURL + "/appversion/details";
    var apiUrlRegisterSettingsDetails = app.serviceBaseURL + "masterdata/config/details";
    var apiUrlPremiumDetails = app.serviceBaseURL + "premium/get";
    var apiUrlUpdatePremium = app.serviceBaseURL + "premium/update";
    var apiUrlAddBasecenter = app.serviceBaseURL + "basecenter/add";
    var apiUrlRefferelText = app.serviceBaseURL + "masterdata/update/referrel/tag";
    var apiUrlRefferelTagGet = app.serviceBaseURL + "masterdata/list";

    var services = {};
    services.RegisterSettings = RegisterSettings;
    services.ReferrerSettings = ReferrerSettings;
    services.CreateAppVersion = CreateAppVersion;
    services.GetAppVersionDetails = GetAppVersionDetails;
    services.GetRegisterSettingsDetails = GetRegisterSettingsDetails;
    services.GetPremiumDetails = GetPremiumDetails;
    services.UpdatePremium = UpdatePremium;
    services.AddBasecenter = AddBasecenter;
    services.AddRefferelTag = AddRefferelTag;
    services.GetRefferalTag = GetRefferalTag;
    return services;

    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    function RegisterSettings(model) {
        
        return $http.post(apiUrlRegister, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }
    function ReferrerSettings(model) {
        
        return $http.post(apiUrlReferrer, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function UpdatePremium(model) {
        
        return $http.post(apiUrlUpdatePremium, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function CreateAppVersion(appVersion, appDesc, isMandatory) {
        
        return $http.post(apiUrlAppVersion + "?appVersion=" + appVersion + "&appDesc=" + appDesc + "&isMandatory=" + isMandatory)
        .success(function (response) {
            return response;
        });
    }
    function GetAppVersionDetails() {
        return $http.get(apiUrlAppVersionDetails)
        .success(function (response) {
            return response;
        });
    }

    function GetPremiumDetails() {
        
        return $http.get(apiUrlPremiumDetails)
        .success(function (response) {
            return response;
        });
    }

    function GetRegisterSettingsDetails() {
        return $http.get(apiUrlRegisterSettingsDetails)
        .success(function (response) {
            return response;
        });
    }

    function AddBasecenter(model) {
        return $http.post(apiUrlAddBasecenter, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function AddRefferelTag(model)
    {
        return $http.post(apiUrlRefferelText, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    } 

    function GetRefferalTag()
    {
        return $http.get(apiUrlRefferelTagGet + "?lastUpdatedOn=0")
        .success(function (response) {
            return response;
        });
    }
}